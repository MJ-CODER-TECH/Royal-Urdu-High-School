import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";

import { getStudents, getStudentById } from "../../redux/student/studentThunk";

import StudentTable from "./StudentTable";
import StudentModal from "./StudentModal";
import StudentFilters from "./StudentFilters";
import StudentView from "./StudentView";

import usePermission from "../../hooks/usePermission";

const StudentsPage = () => {
  const dispatch = useDispatch();

  const canCreate = usePermission("student.create");

  const { students, loading, pagination } = useSelector((state) => state.student);
  const { limit, total } = pagination;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [status, setStatus] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [viewStudent, setViewStudent] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  const query = useMemo(
    () => ({ page, limit, search, classId, sectionId, status }),
    [page, limit, search, classId, sectionId, status],
  );

  useEffect(() => {
    setPage(1);
  }, [search, classId, sectionId, status]);

  useEffect(() => {
    dispatch(getStudents(query));
  }, [dispatch, query]);

  const handleAdd = () => {
    setSelectedStudent(null);
    setOpenModal(true);
  };

  const handleEdit = async (student) => {
    try {
      const result = await dispatch(getStudentById(student.student_id)).unwrap();
      setSelectedStudent(result?.data || result);
      setOpenModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleView = async (student) => {
    setViewOpen(true);
    setViewLoading(true);
    setViewStudent(null);

    try {
      const result = await dispatch(getStudentById(student.student_id)).unwrap();
      setViewStudent(result?.data || result);
    } catch (err) {
      console.error("Failed to fetch student detail:", err);
      setViewStudent(student);
    } finally {
      setViewLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedStudent(null);
    setOpenModal(false);
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setViewStudent(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Students Management
          </h1>
          <p className="text-sm text-slate-500">
            Manage all student records, admissions, and details.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={handleAdd}
            className="
              flex w-fit items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5
              text-sm font-medium text-white shadow-sm transition-colors
              hover:bg-indigo-700 active:bg-indigo-800
            "
          >
            <Plus size={18} />
            Add Student
          </button>
        )}
      </div>

      {/* Filters */}
      <StudentFilters
        search={search}
        setSearch={setSearch}
        classId={classId}
        setClassId={setClassId}
        sectionId={sectionId}
        setSectionId={setSectionId}
        status={status}
        setStatus={setStatus}
      />

      {/* Table */}
      <StudentTable
        students={students}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        setPage={setPage}
        onEdit={handleEdit}
        onView={handleView}
      />

      {/* View Modal */}
      <StudentView
        open={viewOpen}
        student={viewStudent}
        loading={viewLoading}
        onClose={handleViewClose}
      />

      {/* Edit/Add Modal */}
      {openModal && (
        <StudentModal open={openModal} onClose={handleClose} student={selectedStudent} />
      )}
    </div>
  );
};

export default StudentsPage;