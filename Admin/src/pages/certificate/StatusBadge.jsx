import React from "react";

const statusConfig = {
  Generated: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  Pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  Cancelled: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
  },
  Draft: {
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
  },
};

const StatusBadge = ({ status }) => {
  const currentStatus = status || "Draft";
  const config = statusConfig[currentStatus] || statusConfig.Draft;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.bg} ${config.text} ${config.border}`}
    >
      {currentStatus}
    </span>
  );
};

export default StatusBadge;