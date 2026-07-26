import React from "react";
import { Loader2, Save, UserCheck, UserX, AlertCircle } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "Present", label: "P", color: "bg-emerald-600 border-emerald-600 text-white shadow-sm hover:bg-emerald-700" },
  { value: "Absent", label: "A", color: "bg-rose-600 border-rose-600 text-white shadow-sm hover:bg-rose-700" },
  { value: "Late", label: "L", color: "bg-amber-500 border-amber-500 text-white shadow-sm hover:bg-amber-600" },
  { value: "Half Day", label: "HD", color: "bg-orange-500 border-orange-500 text-white shadow-sm hover:bg-orange-600" },
  { value: "Leave", label: "Lv", color: "bg-slate-600 border-slate-600 text-white shadow-sm hover:bg-slate-700" },
];

const AttendanceRegisterTable = ({
  students = [],
  loading = false,
  statusMap = {},
  remarksMap = {},
  onStatusChange,
  onRemarkChange,
  onMarkAll,
  onSave,
  saving = false,
}) => {
  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="mt-3 text-sm font-medium text-slate-600">Loading student records...</p>
      </div>
    );
  }

  // Empty State
  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <AlertCircle className="h-10 w-10 text-slate-400" />
        <h3 className="mt-2 text-base font-semibold text-slate-800">No Students Selected</h3>
        <p className="mt-1 text-sm text-slate-500">
          Class aur Section select karo, student attendance register yaha dikhega.
        </p>
      </div>
    );
  }

  // Summary Count Calculation
  const summary = students.reduce((acc, s) => {
    const status = statusMap[s.student_id] || "Present";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Top Header & Summary Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-slate-50/80 px-6 py-4">
        {/* Status Count Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <div
              key={opt.value}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs"
            >
              <span className="text-slate-500">{opt.value}:</span>
              <span className="font-bold text-slate-900">{summary[opt.value] || 0}</span>
            </div>
          ))}
        </div>

        {/* Quick Bulk Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onMarkAll("Present")}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:bg-slate-100 focus:outline-none"
          >
            <UserCheck size={14} className="text-emerald-600" />
            Mark All Present
          </button>

          <button
            type="button"
            onClick={() => onMarkAll("Absent")}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:bg-slate-100 focus:outline-none"
          >
            <UserX size={14} className="text-rose-600" />
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Main Register Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-100/70 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3.5">Roll No</th>
              <th className="px-6 py-3.5">Student Name</th>
              <th className="px-6 py-3.5">Admission No</th>
              <th className="px-6 py-3.5">Attendance Status</th>
              <th className="px-6 py-3.5">Remarks</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {students.map((student) => {
              const currentStatus = statusMap[student.student_id] || "Present";

              return (
                <tr
                  key={student.student_id}
                  className="transition-colors hover:bg-slate-50/80"
                >
                  {/* Roll No */}
                  <td className="whitespace-nowrap px-6 py-3.5 font-medium text-slate-600">
                    {student.roll_no ? `#${student.roll_no}` : "-"}
                  </td>

                  {/* Student Name */}
                  <td className="whitespace-nowrap px-6 py-3.5">
                    <div className="font-semibold text-slate-800">
                      {student.first_name} {student.last_name}
                    </div>
                  </td>

                  {/* Admission No */}
                  <td className="whitespace-nowrap px-6 py-3.5 text-slate-500">
                    {student.admission_no || "-"}
                  </td>

                  {/* Status Toggle Buttons */}
                  <td className="whitespace-nowrap px-6 py-3.5">
                    <div className="inline-flex rounded-lg bg-slate-100 p-1">
                      {STATUS_OPTIONS.map((opt) => {
                        const isSelected = currentStatus === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => onStatusChange(student.student_id, opt.value)}
                            title={opt.value}
                            className={`h-8 min-w-[36px] px-2 rounded-md text-xs font-bold transition-all ${
                              isSelected
                                ? opt.color
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60"
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </td>

                  {/* Remarks Input */}
                  <td className="px-6 py-3.5">
                    <input
                      type="text"
                      placeholder="Add remark..."
                      value={remarksMap[student.student_id] || ""}
                      onChange={(e) =>
                        onRemarkChange(student.student_id, e.target.value)
                      }
                      className="w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom Save Action Bar */}
      <div className="flex items-center justify-end border-t border-slate-200 bg-slate-50/50 px-6 py-4">
        <button
          type="button"
          disabled={saving}
          onClick={onSave}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving Register...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Attendance
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AttendanceRegisterTable;