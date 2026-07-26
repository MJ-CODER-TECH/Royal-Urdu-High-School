import React from "react";
import { Clock, MapPin, User, BookOpen, CalendarX } from "lucide-react";

// Helper to format 24-hr time to 12-hr format (e.g. 09:30 AM)
const formatTime = (time) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h.toString().padStart(2, "0")}:${minutes} ${ampm}`;
};

const ClassTimetableTable = ({ data = [], loading = false }) => {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <span className="text-sm font-medium">Loading timetable...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <CalendarX size={48} className="mb-3 text-slate-300" />
        <h3 className="text-base font-semibold text-slate-700">
          No Timetable Found
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Select Academic Year, Class, and Section above to view the schedule.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-600">
              <th className="px-5 py-3.5">Day</th>
              <th className="px-5 py-3.5">Period</th>
              <th className="px-5 py-3.5">Subject</th>
              <th className="px-5 py-3.5">Teacher</th>
              <th className="px-5 py-3.5">Time</th>
              <th className="px-5 py-3.5">Room</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {data.map((item, index) => (
              <tr
                key={item.timetable_id || index}
                className="hover:bg-slate-50/60 transition-colors"
              >
                {/* Day Badge */}
                <td className="px-5 py-3.5 font-medium text-slate-800">
                  <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100">
                    {item.day_of_week}
                  </span>
                </td>

                {/* Period Number */}
                <td className="px-5 py-3.5 font-semibold text-slate-900">
                  #{item.period_no}
                </td>

                {/* Subject */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <BookOpen size={16} className="text-indigo-600" />
                    <span>{item.subject_name || "—"}</span>
                  </div>
                </td>

                {/* Teacher */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2 text-slate-600">
                    <User size={15} className="text-slate-400" />
                    <span>{item.teacher_name || "—"}</span>
                  </div>
                </td>

                {/* Time Range */}
                <td className="px-5 py-3.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock size={14} className="text-slate-400" />
                    <span>
                      {formatTime(item.start_time)} - {formatTime(item.end_time)}
                    </span>
                  </div>
                </td>

                {/* Room */}
                <td className="px-5 py-3.5">
                  {item.room ? (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <MapPin size={14} className="text-slate-400" />
                      <span>{item.room}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassTimetableTable;