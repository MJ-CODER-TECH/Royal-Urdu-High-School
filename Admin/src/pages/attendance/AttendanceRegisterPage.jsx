import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  ClipboardList,
  Filter,
  Loader2,
  Save,
  UserCheck,
  UserX,
} from "lucide-react";

import { getClassesApi, getSectionsApi } from "../../api/master.api";
import { getStudentsApi } from "../../api/student.api";
import { getAttendanceApi } from "../../api/attendance.api";
import { bulkAttendance } from "../../redux/attendance/attendanceThunk";

import AttendanceRegisterTable from "./AttendanceRegisterTable";

const todayDate = () => new Date().toISOString().split("T")[0];

const AttendanceRegisterPage = () => {
  const dispatch = useDispatch();

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(todayDate());

  const [students, setStudents] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [remarksMap, setRemarksMap] = useState({});

  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  /* Load Masters (Classes & Sections) */
  useEffect(() => {
    const loadMasters = async () => {
      try {
        const [classList, sectionList] = await Promise.all([
          getClassesApi(),
          getSectionsApi(),
        ]);
        setClasses(classList || []);
        setSections(sectionList || []);
      } catch (error) {
        console.error("Failed to load master data", error);
      }
    };
    loadMasters();
  }, []);

  /* Load Students & Existing Attendance */
  useEffect(() => {
    const loadStudents = async () => {
      if (!classId || !sectionId) {
        setStudents([]);
        return;
      }

      setLoadingStudents(true);

      try {
        const [studentsRes, attendanceRes] = await Promise.all([
          getStudentsApi({
            classId,
            sectionId,
            status: "Active",
            page: 1,
            limit: 500,
          }),
          getAttendanceApi({
            classId,
            sectionId,
            attendanceDate,
            page: 1,
            limit: 500,
          }),
        ]);

        const list = (studentsRes.students || studentsRes.data || [])
          .slice()
          .sort(
            (a, b) =>
              (Number(a.roll_no) || 0) - (Number(b.roll_no) || 0)
          );

        setStudents(list);

        // Safely parse attendance response
        const existingRecords =
          attendanceRes?.data?.data || attendanceRes?.data || [];
        const existingMap = {};
        if (Array.isArray(existingRecords)) {
          existingRecords.forEach((rec) => {
            existingMap[rec.student_id] = rec;
          });
        }

        const defaultStatus = {};
        const defaultRemarks = {};

        list.forEach((s) => {
          const existing = existingMap[s.student_id];
          defaultStatus[s.student_id] = existing?.status || "Present";
          defaultRemarks[s.student_id] = existing?.remarks || "";
        });

        setStatusMap(defaultStatus);
        setRemarksMap(defaultRemarks);
      } catch (error) {
        console.error("Failed to fetch students/attendance", error);
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };

    loadStudents();
  }, [classId, sectionId, attendanceDate]);

  const handleStatusChange = (studentId, status) => {
    setStatusMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleRemarkChange = (studentId, remark) => {
    setRemarksMap((prev) => ({
      ...prev,
      [studentId]: remark,
    }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    students.forEach((s) => {
      updated[s.student_id] = status;
    });
    setStatusMap(updated);
  };

  const handleSave = async () => {
    if (!classId || !sectionId || !attendanceDate) {
      alert("Please select Class, Section and Date.");
      return;
    }

    if (students.length === 0) {
      alert("No active students found in this Class/Section.");
      return;
    }

    const payload = {
      class_id: classId,
      section_id: sectionId,
      attendance_date: attendanceDate,
      attendance: students.map((s) => ({
        student_id: s.student_id,
        status: statusMap[s.student_id] || "Present",
        remarks: remarksMap[s.student_id] || null,
      })),
    };

    setSaving(true);

    try {
      await dispatch(bulkAttendance(payload)).unwrap();
      alert("Bulk attendance saved successfully.");
    } catch (error) {
      alert(error || "Failed to save attendance.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <ClipboardList size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
              Attendance Register
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Bulk mark daily class attendance and submit logs in one click.
          </p>
        </div>

        {/* Top Save Button */}
        {students.length > 0 && (
          <button
            onClick={handleSave}
            disabled={saving || loadingStudents}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving Register...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Attendance
              </>
            )}
          </button>
        )}
      </div>

      {/* Criteria Filters Panel */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Filter size={14} />
          Select Register Criteria
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Class Selector */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Class <span className="text-red-500">*</span>
            </label>
            <select
              value={classId}
              onChange={(e) => {
                setClassId(e.target.value);
                setSectionId("");
              }}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">-- Select Class --</option>
              {classes.map((item) => (
                <option key={item.class_id} value={item.class_id}>
                  {item.class_name}
                </option>
              ))}
            </select>
          </div>

          {/* Section Selector */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Section <span className="text-red-500">*</span>
            </label>
            <select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">-- Select Section --</option>
              {sections.map((section) => (
                <option key={section.section_id} value={section.section_id}>
                  {section.class_name ? `${section.class_name} - ` : ""}
                  {section.section_name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selector */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      {students.length > 0 && !loadingStudents && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3">
          <div className="text-xs font-medium text-slate-600">
            Total Active Students:{" "}
            <span className="font-bold text-slate-800">{students.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Quick Mark All:
            </span>
            <button
              type="button"
              onClick={() => handleMarkAll("Present")}
              className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
            >
              <UserCheck size={14} />
              All Present
            </button>
            <button
              type="button"
              onClick={() => handleMarkAll("Absent")}
              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-100"
            >
              <UserX size={14} />
              All Absent
            </button>
          </div>
        </div>
      )}

      {/* Attendance Register Table Component */}
      <AttendanceRegisterTable
        students={students}
        loading={loadingStudents}
        statusMap={statusMap}
        remarksMap={remarksMap}
        onStatusChange={handleStatusChange}
        onRemarkChange={handleRemarkChange}
        onMarkAll={handleMarkAll}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
};

export default AttendanceRegisterPage;