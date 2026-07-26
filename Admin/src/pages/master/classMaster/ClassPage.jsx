import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Search, Layers } from "lucide-react";

import {
  getClasses,
  deleteClass,
  changeClassStatus,
} from "../../../redux/master/Classmasterthunk";
import { clearSelectedClass } from "../../../redux/master/classMasterSlice";

import ClassTable from "./ClassTable";
import ClassModal from "./ClassModal";

const ClassPage = () => {
  const dispatch = useDispatch();
  const { classList = [], loading } = useSelector((state) => state.classMaster);

  const [openModal, setOpenModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getClasses());
  }, [dispatch]);

  // Filtered list based on search query
  const filteredClasses = useMemo(() => {
    if (!searchQuery.trim()) return classList;
    const query = searchQuery.toLowerCase();
    return classList.filter(
      (item) =>
        item.class_name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
    );
  }, [classList, searchQuery]);

  // Quick stats counters
  const activeCount = useMemo(
    () => classList.filter((c) => c.is_active).length,
    [classList]
  );

  /*
  |--------------------------------------------------------------------------
  | Handlers
  |--------------------------------------------------------------------------
  */

  const handleAdd = () => {
    dispatch(clearSelectedClass());
    setSelectedClass(null);
    setOpenModal(true);
  };

  const handleEdit = (row) => {
    setSelectedClass(row);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;

    const result = await dispatch(deleteClass(id));
    if (deleteClass.fulfilled.match(result)) {
      dispatch(getClasses());
    }
  };

  const handleStatus = async (row) => {
    const result = await dispatch(
      changeClassStatus({
        id: row.class_id,
        is_active: row.is_active ? 0 : 1,
      })
    );

    if (changeClassStatus.fulfilled.match(result)) {
      dispatch(getClasses());
    }
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedClass(null);
    dispatch(clearSelectedClass());
  };

  return (
    <div className="space-y-6 p-1">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Class Master
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Manage academic classes, sections, and their active status
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:bg-blue-800 transition-all cursor-pointer"
        >
          <Plus size={18} />
          Add Class
        </button>
      </div>

      {/* Overview & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-y border-slate-200/80 py-3">
        {/* Quick Stats */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md">
            <Layers size={14} className="text-slate-500" />
            <span>
              Total: <strong className="text-slate-800">{classList.length}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>
              Active: <strong>{activeCount}</strong>
            </span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search classes..."
            className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Main Table */}
      <ClassTable
        data={filteredClasses}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatus={handleStatus}
      />

      {/* Add / Edit Modal */}
      <ClassModal
        open={openModal}
        onClose={handleClose}
        selectedClass={selectedClass}
      />
    </div>
  );
};

export default ClassPage;