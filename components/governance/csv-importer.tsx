"use client";
/**
 * components/governance/csv-importer.tsx
 * Papa Parse bulk CSV importer for campaigns.
 * Validates each row with Zod before showing a preview table.
 */
import React, { useState, useRef } from "react";
import Papa from "papaparse";
import { csvCampaignRowSchema, CSV_CAMPAIGN_HEADERS, type CsvCampaignRow } from "@/lib/schemas/csv-import.schema";
import { useCreateCampaign } from "@/hooks/use-campaigns";
import { Upload, CheckCircle2, XCircle, FileText, Loader2, AlertTriangle } from "lucide-react";

interface ParsedRow {
  index:  number;
  raw:    Record<string, unknown>;
  data?:  CsvCampaignRow;
  errors: string[];
}

export function CsvImporter({ onComplete }: { onComplete?: (count: number) => void }) {
  const [rows, setRows]       = useState<ParsedRow[]>([]);
  const [isDragging, setDrag] = useState(false);
  const [importing, setImp]   = useState(false);
  const [done, setDone]       = useState(false);
  const fileRef               = useRef<HTMLInputElement>(null);
  const createCampaign        = useCreateCampaign();

  function parseFile(file: File) {
    setDone(false);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const parsed: ParsedRow[] = (data as Record<string, unknown>[]).map((raw, i) => {
          const result = csvCampaignRowSchema.safeParse(raw);
          return result.success
            ? { index: i, raw, data: result.data, errors: [] }
            : { index: i, raw, errors: result.error.errors.map((e) => `${e.path[0]}: ${e.message}`) };
        });
        setRows(parsed);
      },
    });
  }

  async function handleImport() {
    const valid = rows.filter((r) => r.data && r.errors.length === 0);
    if (!valid.length) return;
    setImp(true);
    let count = 0;
    for (const row of valid) {
      try {
        await createCampaign.mutateAsync(row.data as any);
        count++;
      } catch { /* individual row failure — continue */ }
    }
    setImp(false);
    setDone(true);
    onComplete?.(count);
  }

  const validCount   = rows.filter((r) => r.errors.length === 0).length;
  const invalidCount = rows.length - validCount;

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging ? "border-modRed bg-red-50" : "border-slate-200 hover:border-modRed/40 hover:bg-slate-50"
        }`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault(); setDrag(false);
          const f = e.dataTransfer.files[0];
          if (f) parseFile(f);
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) parseFile(f); }}
        />
        <FileText size={32} className="mx-auto text-slate-300 mb-3" />
        <p className="text-sm font-bold text-slate-600">Drop CSV or click to browse</p>
        <p className="text-xs text-slate-400 mt-1">
          Required columns: <span className="font-mono">{CSV_CAMPAIGN_HEADERS.join(", ")}</span>
        </p>
      </div>

      {/* Summary badges */}
      {rows.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
            {rows.length} rows parsed
          </span>
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold flex items-center gap-1">
            <CheckCircle2 size={12} /> {validCount} valid
          </span>
          {invalidCount > 0 && (
            <span className="px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-[11px] font-bold flex items-center gap-1">
              <XCircle size={12} /> {invalidCount} errors
            </span>
          )}
          {done && (
            <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold ml-auto">
              ✓ Import complete
            </span>
          )}
        </div>
      )}

      {/* Preview table */}
      {rows.length > 0 && (
        <div className="overflow-auto max-h-64 rounded-xl border border-slate-200">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2.5 text-left font-bold text-slate-500">#</th>
                <th className="px-3 py-2.5 text-left font-bold text-slate-500">Name</th>
                <th className="px-3 py-2.5 text-left font-bold text-slate-500">Approval</th>
                <th className="px-3 py-2.5 text-left font-bold text-slate-500">Runtime (s)</th>
                <th className="px-3 py-2.5 text-left font-bold text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.index} className={row.errors.length ? "bg-red-50/50" : ""}>
                  <td className="px-3 py-2 text-slate-400">{row.index + 1}</td>
                  <td className="px-3 py-2 font-semibold text-slate-800 max-w-[140px] truncate">
                    {String(row.raw.name ?? "—")}
                  </td>
                  <td className="px-3 py-2 text-slate-600">{String(row.raw.approval_type ?? "—")}</td>
                  <td className="px-3 py-2 text-slate-600">{String(row.raw.runtime_seconds ?? "—")}</td>
                  <td className="px-3 py-2">
                    {row.errors.length === 0 ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 size={11} /> Valid
                      </span>
                    ) : (
                      <span className="text-red-600 font-bold flex items-center gap-1" title={row.errors.join("\n")}>
                        <AlertTriangle size={11} /> {row.errors[0]}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Import button */}
      {validCount > 0 && !done && (
        <button
          onClick={handleImport}
          disabled={importing}
          className="flex items-center gap-2 px-5 py-2.5 bg-modRed text-white rounded-lg text-sm font-bold shadow-md shadow-modRed/20 hover:bg-red-700 transition-all disabled:opacity-60"
        >
          {importing ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          Import {validCount} Campaign{validCount !== 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}
