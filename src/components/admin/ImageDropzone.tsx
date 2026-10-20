"use client";

import { useRef, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const COLORS = {
  green: {
    idle: "bg-green-50 border-green-300 hover:bg-green-100 text-green-600",
    active: "bg-green-100 border-green-500 text-green-700",
  },
  blue: {
    idle: "bg-blue-50 border-blue-300 hover:bg-blue-100 text-blue-600",
    active: "bg-blue-100 border-blue-500 text-blue-700",
  },
} as const;

interface ImageDropzoneProps {
  onFiles: (files: File[]) => void;
  label: string;
  multiple?: boolean;
  disabled?: boolean;
  busyLabel?: string;
  color?: keyof typeof COLORS;
}

// クリックでのファイル選択とドラッグ&ドロップの両方に対応した画像選択エリア
export default function ImageDropzone({
  onFiles,
  label,
  multiple = false,
  disabled = false,
  busyLabel = "アップロード中...",
  color = "green",
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  // 子要素への出入りでも dragenter/dragleave が発生するため回数で判定する
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);

  const emit = (fileList: FileList | null) => {
    const files = Array.from(fileList ?? []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length === 0) {
      if (fileList?.length) alert("画像ファイルを選択してください");
      return;
    }
    onFiles(multiple ? files : files.slice(0, 1));
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    dragDepth.current += 1;
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    if (!disabled) emit(e.dataTransfer.files);
  };

  const palette = COLORS[color];

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragEnter={handleDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center w-full px-4 py-8 border-2 border-dashed rounded-lg transition-colors select-none ${
        dragging ? palette.active : palette.idle
      } ${disabled ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
    >
      <CloudUploadIcon className="mb-2" fontSize="large" />
      <span className="text-sm font-semibold text-center">
        {disabled ? busyLabel : dragging ? "ここにドロップ" : label}
      </span>
      {!disabled && !dragging && (
        <span className="text-xs mt-1 opacity-80 text-center">
          ドラッグ&ドロップ、またはクリックして選択
          {multiple && "（複数可）"}・JPEG / PNG / WebP、1枚20MBまで
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          emit(e.target.files);
          e.target.value = "";
        }}
        className="hidden"
      />
    </div>
  );
}
