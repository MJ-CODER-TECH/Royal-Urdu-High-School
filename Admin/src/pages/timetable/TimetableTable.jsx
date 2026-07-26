import React from "react";
import { Pencil, Trash2, Clock, Calendar, MapPin, User, BookOpen } from "lucide-react";

const TimetableTable = ({
  loading = false,
  timetables = [],
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  // Skeleton Loader for smooth loading state
  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="p-4 space-y-3">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="h-10 w-full animate-pulse rounded-lg bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full text-left border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            <th className="px-4 py-3 text-center">#</th>
            <th className="px-4 py-3">Class</th>
            <th className="px-4 py-3">Section</th>
            <th className="px-4 py-3">Subject</th>
            <th className="px-4 py-3">Teacher</th>
            <th className="px-4 py-3">Day</th>
            <th className="px-4 py-3 text-center">Period</th>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Room</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
          {timetables.length === 0 ? (
            <tr>
              <td
                colSpan="11"
                className="py-12 text-center text-slate-400 font-medium"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <Calendar size={32} className="text-slate-300 stroke-[1.5]" />
                  <p>No timetable schedules found.</p>
                </div>
              </td>
            </tr>
          ) : (
            timetables.map((item, index) => {
              const isActive = item.status === "Active";

              return (
                <tr
                  key={item.timetable_id || index}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* Row Number */}
                  <td className="px-4 py-3.5 text-center text-slate-400 font-mono">
                    {index + 1}
                  </td>

                  {/* Class */}
                  <td className="px-4 py-3.5 font-medium text-slate-900">
                    {item.class_name || "—"}
                  </td>

                  {/* Section */}
                  <td className="px-4 py-3.5 text-slate-600">
                    {item.section_name || "—"}
                  </td>

                  {/* Subject */}
                  <td className="px-4 py-3.5 font-medium text-indigo-950">
                    <div className="inline-flex items-center gap-1.5">
                      <BookOpen size={13} className="text-indigo-500 shrink-0" />
                      <span>{item.subject_name || "—"}</span>
                    </div>
                  </td>

                  {/* Teacher */}
                  <td className="px-4 py-3.5 text-slate-600">
                    <div className="inline-flex items-center gap-1.5">
                      <User size={13} className="text-slate-400 shrink-0" />
                      <span>{item.teacher_name || "Unassigned"}</span>
                    </div>
                  </td>

                  {/* Day */}
                  <td className="px-4 py-3.5">
                    <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                      {item.day_of_week || "—"}
                    </span>
                  </td>

                  {/* Period */}
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
                      {item.period_no ?? "—"}
                    </span>
                  </td>

                  {/* Time Slot */}
                  <td className="px-4 py-3.5 text-slate-600 font-mono text-[11px]">
                    {item.start_time || item.end_time ? (
                      <div className="inline-flex items-center gap-1">
                        <Clock size={12} className="text-slate-400" />
                        <span>
                          {item.start_time} - {item.end_time}
                        </span>
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Room */}
                  <td className="px-4 py-3.5 text-slate-600">
                    {item.room ? (
                      <div className="inline-flex items-center gap-1 text-slate-600">
                        <MapPin size={12} className="text-slate-400" />
                        <span>{item.room}</span>
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Status Toggle Button */}
                  <td className="px-4 py-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => onStatusChange?.(item)}
                      className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                      }`}
                    >
                      <span
                        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                          isActive ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                      {item.status || "Inactive"}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit?.(item)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
                        title="Edit Schedule"
                        aria-label="Edit schedule"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete?.(item.timetable_id)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Schedule"
                        aria-label="Delete schedule"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TimetableTable;