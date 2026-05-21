"use client";
/**
 * components/governance/asset-uploader.tsx
 * Drag-and-drop file uploader using native browser APIs (no Uppy dependency needed yet).
 * Uppy plugin wiring is commented below — uncomment when @uppy/* packages are installed.
 *
 * On upload success: invalidates the 'templates' TanStack Query cache.
 */
import React, { useState, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Upload, X, CheckCircle2, Loader2, Film, Image, FileWarning } from "lucide-react";

const ACCEPTED = ["video/mp4", "image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_MB   = 100;

interface UploadFile {
  id:       string;
  file:     File;
  preview?: string;
  progress: number;              // 0–100
  status:   "pending" | "uploading" | "done" | "error";
  error?:   string;
}

function simulateUpload(file: File, onProgress: (p: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 20 + 10;
      onProgress(Math.min(p, 95));
      if (p >= 95) {
        clearInterval(interval);
        setTimeout(() => {
          onProgress(100);
          // Simulate 5% failure rate for demo
          Math.random() > 0.05 ? resolve() : reject(new Error("Upload failed"));
        }, 300);
      }
    }, 200);
  });
}

export function AssetUploader({ onUploaded }: { onUploaded?: (count: number) => void }) {
  const [files, setFiles]     = useState<UploadFile[]>([]);
  const [isDragging, setDrag] = useState(false);
  const inputRef              = useRef<HTMLInputElement>(null);
  const qc                    = useQueryClient();

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const newFiles: UploadFile[] = Array.from(incoming)
      .filter((f) => ACCEPTED.includes(f.type) && f.size <= MAX_MB * 1024 * 1024)
      .map((f) => ({
        id:       `${f.name}-${f.size}`,
        file:     f,
        preview:  f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
        progress: 0,
        status:   "pending" as const,
      }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  async function startUpload() {
    const pending = files.filter((f) => f.status === "pending");
    if (!pending.length) return;

    for (const uf of pending) {
      setFiles((prev) =>
        prev.map((f) => (f.id === uf.id ? { ...f, status: "uploading" } : f))
      );
      try {
        await simulateUpload(uf.file, (p) =>
          setFiles((prev) => prev.map((f) => (f.id === uf.id ? { ...f, progress: p } : f)))
        );
        setFiles((prev) =>
          prev.map((f) => (f.id === uf.id ? { ...f, status: "done", progress: 100 } : f))
        );
      } catch (err: any) {
        setFiles((prev) =>
          prev.map((f) => (f.id === uf.id ? { ...f, status: "error", error: err.message } : f))
        );
      }
    }

    // Invalidate template/asset cache
    qc.invalidateQueries({ queryKey: ["templates"] });
    qc.invalidateQueries({ queryKey: ["assets"] });
    const doneCount = files.filter((f) => f.status === "done").length + pending.length;
    onUploaded?.(doneCount);
  }

  const remove = (id: string) =>
    setFiles((prev) => {
      const f = prev.find((x) => x.id === id);
      if (f?.preview) URL.revokeObjectURL(f.preview);
      return prev.filter((x) => x.id !== id);
    });

  const pendingCount = files.filter((f) => f.status === "pending").length;

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging ? "border-modRed bg-red-50" : "border-slate-200 hover:border-modRed/40 hover:bg-slate-50"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED.join(",")}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <Upload size={32} className="mx-auto text-slate-300 mb-3" />
        <p className="text-sm font-bold text-slate-600">Drop files or click to browse</p>
        <p className="text-xs text-slate-400 mt-1">MP4, JPG, PNG, GIF, WebP · Max {MAX_MB} MB each</p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {files.map((uf) => (
            <div key={uf.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              {/* Thumbnail or icon */}
              <div className="h-12 w-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                {uf.preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={uf.preview} alt={uf.file.name} className="h-full w-full object-cover" />
                ) : uf.file.type.startsWith("video/") ? (
                  <Film size={20} className="text-slate-400" />
                ) : (
                  <Image size={20} className="text-slate-400" />
                )}
              </div>

              {/* Info + progress */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{uf.file.name}</p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {(uf.file.size / 1_048_576).toFixed(1)} MB
                </p>
                {uf.status === "uploading" && (
                  <div className="mt-1.5 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-modRed transition-all duration-200 rounded-full"
                      style={{ width: `${uf.progress}%` }}
                    />
                  </div>
                )}
                {uf.error && <p className="text-[10px] text-red-500 font-bold mt-0.5">{uf.error}</p>}
              </div>

              {/* Status icon */}
              <div className="shrink-0">
                {uf.status === "pending"    && <button onClick={() => remove(uf.id)} className="text-slate-300 hover:text-red-400 transition-colors"><X size={16} /></button>}
                {uf.status === "uploading"  && <Loader2 size={16} className="animate-spin text-modRed" />}
                {uf.status === "done"       && <CheckCircle2 size={16} className="text-emerald-500" />}
                {uf.status === "error"      && <FileWarning size={16} className="text-red-400" />}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {pendingCount > 0 && (
        <button
          onClick={startUpload}
          className="flex items-center gap-2 px-5 py-2.5 bg-modRed text-white rounded-lg text-sm font-bold shadow-md shadow-modRed/20 hover:bg-red-700 transition-all"
        >
          <Upload size={15} />
          Upload {pendingCount} file{pendingCount !== 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}
