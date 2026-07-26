import React from "react";

const STATUS_CONFIG = {
  Present: {
    styles: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    dot: "bg-emerald-500",
  },
  Absent: {
    styles: "bg-rose-50 text-rose-700 border-rose-200/80",
    dot: "bg-rose-500",
  },
  Leave: {
    styles: "bg-amber-50 text-amber-700 border-amber-200/80",
    dot: "bg-amber-500",
  },
  Late: {
    styles: "bg-sky-50 text-sky-700 border-sky-200/80",
    dot: "bg-sky-500",
  },
  "Half Day": {
    styles: "bg-orange-50 text-orange-700 border-orange-200/80",
    dot: "bg-orange-500",
  },
};

const DEFAULT_CONFIG = {
  styles: "bg-slate-50 text-slate-600 border-slate-200",
  dot: "bg-slate-400",
};

const AttendanceStatusBadge = ({ status, showDot = true, className = "" }) => {
  const config = STATUS_CONFIG[status] || DEFAULT_CONFIG;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-2xs transition-colors ${config.styles} ${className}`}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
          aria-hidden="true"
        />
      )}
      <span>{status || "-"}</span>
    </span>
  );
};

export default AttendanceStatusBadge;