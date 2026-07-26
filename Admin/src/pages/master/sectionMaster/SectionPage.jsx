import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";

import {
  getSections,
  deleteSection,
  changeSectionStatus,
} from "../../../redux/section/sectionThunk";

import { clearSelectedSection } from "../../../redux/section/sectionSlice";

import SectionTable from "./SectionTable";
import SectionModal from "./SectionModal";

const SectionPage = () => {
  const dispatch = useDispatch();

  const { sectionList = [], loading = false } = useSelector(
    (state) => state.section
  );

  const [openModal, setOpenModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    dispatch(getSections());
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Add Section
  |--------------------------------------------------------------------------
  */
  const handleAdd = useCallback(() => {
    dispatch(clearSelectedSection());
    setSelectedSection(null);
    setOpenModal(true);
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Edit Section
  |--------------------------------------------------------------------------
  */
  const handleEdit = useCallback((row) => {
    setSelectedSection(row);
    setOpenModal(true);
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Delete Section
  |--------------------------------------------------------------------------
  */
  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this section?")) {
        return;
      }

      try {
        await dispatch(deleteSection(id)).unwrap();
        dispatch(getSections());
      } catch (error) {
        console.error("Failed to delete section:", error);
      }
    },
    [dispatch]
  );

  /*
  |--------------------------------------------------------------------------
  | Toggle Status
  |--------------------------------------------------------------------------
  */
  const handleStatus = useCallback(
    async (row) => {
      try {
        await dispatch(
          changeSectionStatus({
            id: row.section_id,
            is_active: row.is_active ? 0 : 1,
          })
        ).unwrap();
        dispatch(getSections());
      } catch (error) {
        console.error("Failed to update status:", error);
      }
    },
    [dispatch]
  );

  /*
  |--------------------------------------------------------------------------
  | Close Modal
  |--------------------------------------------------------------------------
  */
  const handleClose = useCallback(() => {
    setOpenModal(false);
    setSelectedSection(null);
    dispatch(clearSelectedSection());
  }, [dispatch]);

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Section Master
          </h1>
          <p className="text-sm text-gray-500">
            Manage your school sections, view active status, and update details.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus size={18} />
          <span>Add Section</span>
        </button>
      </div>

      {/* Table */}
      <SectionTable
        data={sectionList}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatus={handleStatus}
      />

      {/* Modal */}
      <SectionModal
        open={openModal}
        onClose={handleClose}
        selectedSection={selectedSection}
      />
    </div>
  );
};

export default SectionPage;