import { NextRequest, NextResponse } from "next/server";
import { getMessaging } from "firebase-admin/messaging";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    getFirebaseAdminApp();

    const { token, title, body, data } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    if (!title || !body) {
      return NextResponse.json(
        { error: "Title and body are required" },
        { status: 400 }
      );
    }

    const messaging = getMessaging();

    const message = {
      token,
      notification: {
        title,
        body,
      },
      data: data || {},
      webpush: {
        fcmOptions: {
          link: process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000",
        },
      },
    };

    const response = await messaging.send(message);

    return NextResponse.json({
      success: true,
      messageId: response,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}