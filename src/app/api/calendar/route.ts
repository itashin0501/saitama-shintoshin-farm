import { NextResponse } from "next/server";

interface CalendarEvent {
  uid: string;
  summary: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
}

function parseICalDate(dateStr: string): Date {
  // Remove TZID parameter if present
  const cleanDateStr = dateStr.split(':').pop() || dateStr;
  
  if (cleanDateStr.includes("T")) {
    // Format: YYYYMMDDTHHMMSS or YYYYMMDDTHHMMSSZ
    const isUTC = cleanDateStr.endsWith("Z");
    const dateOnly = cleanDateStr.replace("Z", "");
    const year = parseInt(dateOnly.substring(0, 4));
    const month = parseInt(dateOnly.substring(4, 6)) - 1;
    const day = parseInt(dateOnly.substring(6, 8));
    const hour = parseInt(dateOnly.substring(9, 11) || "0");
    const minute = parseInt(dateOnly.substring(11, 13) || "0");
    const second = parseInt(dateOnly.substring(13, 15) || "0");
    
    if (isUTC) {
      return new Date(Date.UTC(year, month, day, hour, minute, second));
    } else {
      return new Date(year, month, day, hour, minute, second);
    }
  }

  // Format: YYYYMMDD (all day event)
  const year = parseInt(cleanDateStr.substring(0, 4));
  const month = parseInt(cleanDateStr.substring(4, 6)) - 1;
  const day = parseInt(cleanDateStr.substring(6, 8));
  return new Date(year, month, day);
}

function parseICalData(icalData: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const lines = icalData.split("\n").map((line) => line.trim());

  let currentEvent: Partial<CalendarEvent> | null = null;
  let multiLineValue = "";
  let multiLineKey = "";

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (line.startsWith(" ") && multiLineKey) {
      multiLineValue += line.substring(1);
      continue;
    }

    if (multiLineKey && multiLineValue) {
      if (currentEvent) {
        switch (multiLineKey) {
          case "SUMMARY":
            currentEvent.summary = multiLineValue;
            break;
          case "DESCRIPTION":
            currentEvent.description = multiLineValue;
            break;
          case "LOCATION":
            currentEvent.location = multiLineValue;
            break;
        }
      }
      multiLineKey = "";
      multiLineValue = "";
    }

    if (line === "BEGIN:VEVENT") {
      currentEvent = {};
      continue;
    }

    if (line === "END:VEVENT" && currentEvent) {
      if (
        currentEvent.uid &&
        currentEvent.summary &&
        currentEvent.start &&
        currentEvent.end
      ) {
        events.push(currentEvent as CalendarEvent);
      }
      currentEvent = null;
      continue;
    }

    if (!currentEvent) continue;

    const [key, ...valueParts] = line.split(":");
    const value = valueParts.join(":");

    if (!value) continue;

    if (key.startsWith("DTSTART")) {
      currentEvent.start = parseICalDate(value);
    } else if (key.startsWith("DTEND")) {
      currentEvent.end = parseICalDate(value);
    } else if (key === "UID") {
      currentEvent.uid = value;
    } else if (key === "SUMMARY") {
      if (line.endsWith("\\") || lines[i + 1]?.startsWith(" ")) {
        multiLineKey = "SUMMARY";
        multiLineValue = value;
      } else {
        currentEvent.summary = value;
      }
    } else if (key === "DESCRIPTION") {
      if (line.endsWith("\\") || lines[i + 1]?.startsWith(" ")) {
        multiLineKey = "DESCRIPTION";
        multiLineValue = value;
      } else {
        currentEvent.description = value;
      }
    } else if (key === "LOCATION") {
      if (line.endsWith("\\") || lines[i + 1]?.startsWith(" ")) {
        multiLineKey = "LOCATION";
        multiLineValue = value;
      } else {
        currentEvent.location = value;
      }
    }
  }

  return events.sort((a, b) => a.start.getTime() - b.start.getTime());
}

export async function GET() {
  try {
    const icalUrl =
      "https://calendar.google.com/calendar/ical/fruits.hatake%40gmail.com/public/basic.ics";

    const response = await fetch(icalUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Calendar-Reader/1.0)",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch iCal data: ${response.status}`);
    }

    const icalData = await response.text();
    const events = parseICalData(icalData);
    const now = new Date();
    const futureEvents = events
      .filter((event) => event.start >= now)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      events: futureEvents,
    });
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch calendar data",
      },
      { status: 500 }
    );
  }
}
