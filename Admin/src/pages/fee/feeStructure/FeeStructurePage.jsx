import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  getFeeStructures,
  deleteFeeStructure,
} from "../../../redux/fee/feeStructure/feeStructureThunk";

import { getFeeHeads } from "../../../redux/fee/feeHead/feeHeadThunk";
import { fetchClasses } from "../../../redux/master/classMasterThunk";
import { fetchAcademicYears } from "../../../redux/master/academicYearThunk";

import FeeStructureTable from "./FeeStructureTable";
import FeeStructureModal from "./FeeStructureModal";
import FeeStructureFilter from "./FeeStructureFilter";

const FeeStructurePage = () => {
  const dispatch = useDispatch();

  // REDUX SELECTORS
  const {
    feeStructures = [],
    loading,
    pagination = {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  } = useSelector((state) => state.feeStructure || {});

  const classes = useSelector(
    (state) => state.classMaster?.classes || []
  );

  const feeHeads = useSelector(
    (state) => state.feeHead?.feeHeads || []
  );

  const academicYears = useSelector(
    (state) => state.academicYear?.academicYears || []
  );

  const permissions = useSelector(
    (state) => state.auth?.user?.permissions || []
  );

  // LOCAL STATES
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [classId, setClassId] = useState("");
  const [feeHeadId, setFeeHeadId] = useState("");
  const [status, setStatus] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Fetch / Refresh Data Wrapper
  |--------------------------------------------------------------------------
  */
  const refreshData = useCallback(() => {
    const params = {
      page,
      limit: 10,
    };

    if (academicYearId) params.academicYearId = academicYearId;
    if (search.trim()) params.search = search.trim();
    if (classId) params.classId = classId;
    if (feeHeadId) params.feeHeadId = feeHeadId;
    if (status) params.status = status;

    dispatch(getFeeStructures(params));
  }, [dispatch, page, search, classId, feeHeadId, status, academicYearId]);

  /*
  |--------------------------------------------------------------------------
  | Filter Helpers (Resets Page to 1 on Change)
  |--------------------------------------------------------------------------
  */
  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleClassChange = (val) => {
    setClassId(val);
    setPage(1);
  };

  const handleFeeHeadChange = (val) => {
    setFeeHeadId(val);
    setPage(1);
  };

  const handleStatusChange = (val) => {
    setStatus(val);
    setPage(1);
  };

  const handleAcademicYearChange = (val) => {
    setAcademicYearId(val);
    setPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | Initial Load for Masters
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchAcademicYears());
    dispatch(
      getFeeHeads({
        page: 1,
        limit: 100,
      })
    );
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Load Fee Structures on Dependency Changes
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  /*
  |--------------------------------------------------------------------------
  | Add & Edit Actions
  |--------------------------------------------------------------------------
  */
  const handleAdd = () => {
    setSelectedData(null);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedData(item);
    setModalOpen(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Handler
  |--------------------------------------------------------------------------
  */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Fee Structure?")) {
      return;
    }

    try {
      await dispatch(deleteFeeStructure(id)).unwrap();
      refreshData();
    } catch (error) {
      console.error("Failed to delete fee structure:", error);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Fee Structure
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage class-wise fee allocations and fee heads.
          </p>
        </div>

        {permissions.includes("feeStructure.create") && (
          <button
            type="button"
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all shadow-sm shadow-blue-200"
          >
            <Plus size={18} />
            <span>Add Fee Structure</span>
          </button>
        )}
      </div>

      {/* FILTER */}
      <FeeStructureFilter
        search={search}
        setSearch={handleSearchChange}
        academicYearId={academicYearId}
        setAcademicYearId={handleAcademicYearChange}
        classId={classId}
        setClassId={handleClassChange}
        feeHeadId={feeHeadId}
        setFeeHeadId={handleFeeHeadChange}
        status={status}
        setStatus={handleStatusChange}
        classes={classes}
        feeHeads={feeHeads}
        academicYears={academicYears}
      />

      {/* TABLE */}
      <FeeStructureTable
        data={feeStructures}
        loading={loading}
        pagination={pagination}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPageChange={setPage}
      />

      {/* MODAL */}
      <FeeStructureModal
        open={modalOpen}
        close={() => {
          setModalOpen(false);
          refreshData();
        }}
        data={selectedData}
        classes={classes}
        feeHeads={feeHeads}
        academicYears={academicYears}
      />
    </div>
  );
};

export default FeeStructurePage;