import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  getFeeHeads,
  deleteFeeHead,
} from "../../../redux/fee/feeHead/feeHeadThunk";

import FeeHeadTable from "./FeeHeadTable";
import FeeHeadModal from "./FeeHeadModal";
import FeeHeadFilters from "./FeeHeadFilters";

const FeeHeadPage = () => {
  const dispatch = useDispatch();

  const {
    feeHeads = [],
    loading = false,
    pagination = { page: 1, limit: 10, total: 0 },
  } = useSelector((state) => state.feeHead || {});

  const [openModal, setOpenModal] = useState(false);
  const [selectedFeeHead, setSelectedFeeHead] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    limit: 10,
  });

  /*
  |--------------------------------------------------------------------------
  | FETCH DATA
  |--------------------------------------------------------------------------
  */
  const loadData = useCallback(() => {
    dispatch(getFeeHeads(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /*
  |--------------------------------------------------------------------------
  | HANDLERS
  |--------------------------------------------------------------------------
  */
  const handleAdd = () => {
    setSelectedFeeHead(null);
    setOpenModal(true);
  };

  const handleEdit = (data) => {
    setSelectedFeeHead(data);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this fee head?"
    );

    if (!confirmDelete) return;

    try {
      const res = await dispatch(deleteFeeHead(id)).unwrap();
      toast.success(res?.message || "Fee Head deleted successfully");
      loadData(); // Delete ke baad dynamic refresh
    } catch (error) {
      toast.error(error?.message || error || "Failed to delete Fee Head");
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Filter change hone par initial page reset
    }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleModalClose = (shouldRefresh = false) => {
    setOpenModal(false);
    setSelectedFeeHead(null);
    if (shouldRefresh) {
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Fee Head</h1>
          <p className="text-sm text-gray-500">
            Manage school fee categories and heads
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
        >
          <Plus size={18} />
          <span>Add Fee Head</span>
        </button>
      </div>

      {/* FILTER */}
      <FeeHeadFilters filters={filters} onChange={handleFilterChange} />

      {/* TABLE */}
      <FeeHeadTable
        data={feeHeads}
        loading={loading}
        pagination={pagination}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPageChange={handlePageChange}
      />

      {/* MODAL */}
      {openModal && (
        <FeeHeadModal
          open={openModal}
          close={handleModalClose}
          data={selectedFeeHead}
        />
      )}
    </div>
  );
};

export default FeeHeadPage;