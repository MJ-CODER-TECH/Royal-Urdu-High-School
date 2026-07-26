import { Pencil, Trash2, Eye, ChevronLeft, ChevronRight, User, Users } from "lucide-react";
import { useDispatch } from "react-redux";

import { deleteStudent, changeStudentStatus } from "../../redux/student/studentThunk";

import StatusBadge from "../user/StatusBadge";
import usePermission from "../../hooks/usePermission";

const API_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/api\/v\d+\/?$/, "");
const columns = [
  "Photo",
  "Admission No",
  "GR No",
  "Roll No",
  "Student Name",
  "Class",
  "Section",
  "Mobile",
  "Status",
  "Actions",
];

const StudentTable = ({
  students = [],
  loading,
  page,
  limit,
  total,
  setPage,
  onEdit,
  onView,
}) => {
  const dispatch = useDispatch();

  const canEdit = usePermission("student.update");
  const canDelete = usePermission("student.delete");
  const canView = usePermission("student.view");

  const totalPages = Math.max(1, Math.ceil((total || 0) / (limit || 1)));
  const rows = Array.isArray(students) ? students : [];

  const handleDelete = (studentId) => {
    if (window.confirm("Delete this student? This action cannot be undone.")) {
      dispatch(deleteStudent(studentId));
    }
  };

  const handleStatus = (student) => {
    dispatch(
      changeStudentStatus({
        id: student.student_id,
        isActive: student.status !== "Active",
      }),
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 first:text-center last:text-center"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-100">
                  {columns.map((_, j) => (
                    <td key={j} className="px-4 py-3.5">
                      <div className="h-4 w-full max-w-[100px] animate-pulse rounded bg-slate-100" />
                    </td>
                  ))}
                </tr>
              ))}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="py-16">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <Users size={30} strokeWidth={1.5} />
                    <p className="text-sm">No students found</p>
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              rows.map((student, i) => {
                const fullName = [student.first_name, student.middle_name, student.last_name]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <tr
                    key={student.student_id}
                    className={`
                      transition-colors hover:bg-slate-50
                      ${i !== rows.length - 1 ? "border-b border-slate-100" : ""}
                    `}
                  >
                    {/* Photo */}
                    <td className="px-4 py-3">
                      <div className="mx-auto h-11 w-11 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                        {student?.photo_path ? (
                          <img
                            src={`${API_BASE_URL}/${student.photo_path}`}
                            alt={fullName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-400">
                            <User size={18} />
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-600">{student.admission_no}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{student.gr_no || "-"}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{student.roll_no || "-"}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{fullName}</td>
                    <td className="px-4 py-3 text-center text-sm text-slate-600">
                      {student.class_name || student.class_id || "-"}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-slate-600">
                      {student.section_name || student.section_id || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{student.mobile || "-"}</td>

                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleStatus(student)}>
                        <StatusBadge active={student.status === "Active"} />
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-1">
                        {canView && (
                          <button
                            onClick={() => (onView ? onView(student) : console.log(student))}
                            title="View"
                            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Eye size={17} />
                          </button>
                        )}

                        {canEdit && (
                          <button
                            onClick={() => onEdit(student)}
                            title="Edit"
                            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Pencil size={17} />
                          </button>
                        )}

                        {canDelete && (
                          <button
                            onClick={() => handleDelete(student.student_id)}
                            title="Delete"
                            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={17} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-4 py-3.5 sm:flex-row">
        <span className="text-sm text-slate-500">
          Total: <span className="font-medium text-slate-900">{total || 0}</span> students
        </span>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="
              rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors
              hover:bg-slate-50 hover:text-slate-900
              disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent
            "
          >
            <ChevronLeft size={17} />
          </button>

          <span className="min-w-[70px] text-center text-sm text-slate-600">
            {page} / {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="
              rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors
              hover:bg-slate-50 hover:text-slate-900
              disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent
            "
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentTable;