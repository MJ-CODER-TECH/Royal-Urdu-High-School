import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Award } from "lucide-react";

import { getCertificates } from "../../redux/certificate/certificateThunk";

import CertificateTable from "./CertificateTable";
import CertificateFilters from "./CertificateFilters";
import CertificateGenerateModal from "./CertificateModal";

const CertificatePage = () => {
  const dispatch = useDispatch();

  const {
    certificates = [],
    loading = false,
    page = 1,
    totalPages = 1,
  } = useSelector((state) => state.certificate || {});

  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    limit: 20,
    type: "",
    classId: "",
    sectionId: "",
    status: "",
  });

  const [openGenerate, setOpenGenerate] = useState(false);

  // Debounce API dispatch for search & filter changes
  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(getCertificates(filters));
    }, 400);

    return () => clearTimeout(handler);
  }, [dispatch, filters]);

  const handleModalClose = () => {
    setOpenGenerate(false);
    // Certificate add/update hone ke baad list refresh
    dispatch(getCertificates(filters));
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Award className="text-indigo-600" size={28} />
            <h1 className="text-2xl font-bold text-slate-800">
              Certificates
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Generate, manage, and download official student certificates.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpenGenerate(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          <Plus size={18} />
          Generate Certificate
        </button>
      </div>

      {/* Filters Section */}
      <CertificateFilters filters={filters} setFilters={setFilters} />

      {/* Table Section */}
      <CertificateTable
        data={certificates}
        loading={loading}
        page={page}
        totalPages={totalPages}
        filters={filters}
        setFilters={setFilters}
      />

      {/* Generate / Edit Modal */}
      <CertificateGenerateModal
        open={openGenerate}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default CertificatePage;