import React, { useEffect, useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import { getClassesApi, getSectionsApi } from "../../api/master.api";

const CertificateFilters = ({ filters, setFilters }) => {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

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
        console.error("Failed to load filter options", error);
      }
    };

    loadMasters();
  }, []);

  const handleChange = (key, value) => {
    setFilters((prev) => {
      const updated = {
        ...prev,
        page: 1,
        [key]: value,
      };

      // Class change hone par Section filter reset kar rahe hain
      if (key === "classId") {
        updated.sectionId = "";
      }

      return updated;
    });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      type: "",
      classId: "",
      sectionId: "",
      status: "",
      page: 1,
      limit: 20,
    });
  };

  // Agar class select ki gayi hai, toh related sections hi dikhenge
  const filteredSections = filters.classId
    ? sections.filter((s) => String(s.class_id) === String(filters.classId))
    : sections;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-2.5 text-slate-400"
          />
          <input
            type="text"
            value={filters.search}
            placeholder="Search student..."
            onChange={(e) => handleChange("search", e.target.value)}
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        {/* Certificate Type */}
        <select
          value={filters.type}
          onChange={(e) => handleChange("type", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-hidden"
        >
          <option value="">All Types</option>
          <option value="Bonafide">Bonafide</option>
          <option value="Transfer Certificate">Transfer Certificate</option>
          <option value="Leaving Certificate">Leaving Certificate</option>
          <option value="Character Certificate">Character Certificate</option>
        </select>

        {/* Class */}
        <select
          value={filters.classId}
          onChange={(e) => handleChange("classId", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-hidden"
        >
          <option value="">All Classes</option>
          {classes.map((item) => (
            <option key={item.class_id} value={item.class_id}>
              {item.class_name}
            </option>
          ))}
        </select>

        {/* Section */}
        <select
          value={filters.sectionId}
          onChange={(e) => handleChange("sectionId", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-hidden"
        >
          <option value="">All Sections</option>
          {filteredSections.map((section) => (
            <option key={section.section_id} value={section.section_id}>
              {section.class_name ? `${section.class_name} - ` : ""}
              {section.section_name}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-hidden"
        >
          <option value="">All Status</option>
          <option value="Generated">Generated</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Clear Button */}
        <button
          type="button"
          onClick={clearFilters}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <RotateCcw size={16} />
          Clear
        </button>
      </div>
    </div>
  );
};

export default CertificateFilters;