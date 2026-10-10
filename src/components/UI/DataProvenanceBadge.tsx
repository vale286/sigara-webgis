import React from "react";
import { Database } from "lucide-react";

interface DataProvenanceBadgeProps {
  filename: string;
  year?: number;
  unit?: string;
  province?: string;
}

export const DataProvenanceBadge: React.FC<DataProvenanceBadgeProps> = ({
  filename,
  year = 2018,
  unit,
  province,
}) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200">
      <Database className="w-3 h-3 text-brand-primary shrink-0" />
      <span className="truncate max-w-[200px]" title={filename}>
        {filename}
      </span>
      <span className="text-slate-400">|</span>
      <span>{year}</span>
      {unit && (
        <>
          <span className="text-slate-400">|</span>
          <span>{unit}</span>
        </>
      )}
      {province && (
        <>
          <span className="text-slate-400">|</span>
          <span className="font-sans font-medium text-brand-primary">{province}</span>
        </>
      )}
    </div>
  );
};
