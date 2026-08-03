import React, { useEffect, useMemo, useState } from "react";
import { RotateCcw, Search } from "lucide-react";

import {
  getClassesApi,
  getSectionsApi,
} from "../../api/master.api";

const CertificateFilters = ({
  filters,
  setFilters,
}) => {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const loadMasters = async () => {
      try {
        const [
          classList,
          sectionList,
        ] = await Promise.all([
          getClassesApi(),
          getSectionsApi(),
        ]);

        setClasses(
          Array.isArray(classList)
            ? classList
            : []
        );

        setSections(
          Array.isArray(sectionList)
            ? sectionList
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load certificate filters:",
          error
        );

        setClasses([]);
        setSections([]);
      }
    };

    loadMasters();
  }, []);

  const filteredSections = useMemo(() => {
    if (!filters.classId) {
      return [];
    }

    return sections.filter(
      (section) =>
        String(section.class_id) ===
        String(filters.classId)
    );
  }, [
    sections,
    filters.classId,
  ]);

  const handleChange = (
    key,
    value
  ) => {
    setFilters((previous) => {
      const updated = {
        ...previous,
        [key]: value,
        page: 1,
      };

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

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
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
            onChange={(event) =>
              handleChange(
                "search",
                event.target.value
              )
            }
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Certificate Type */}
        <select
          value={filters.type}
          onChange={(event) =>
            handleChange(
              "type",
              event.target.value
            )
          }
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">
            All Types
          </option>

          <option value="Bonafide">
            Bonafide
          </option>

          <option value="Transfer Certificate">
            Transfer Certificate
          </option>

          <option value="Leaving Certificate">
            Leaving Certificate
          </option>

          <option value="Character Certificate">
            Character Certificate
          </option>
        </select>

        {/* Class */}
        <select
          value={filters.classId}
          onChange={(event) =>
            handleChange(
              "classId",
              event.target.value
            )
          }
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">
            All Classes
          </option>

          {classes.map((item) => (
            <option
              key={item.class_id}
              value={item.class_id}
            >
              {item.class_name}
            </option>
          ))}
        </select>

        {/* Section */}
        <select
          value={filters.sectionId}
          onChange={(event) =>
            handleChange(
              "sectionId",
              event.target.value
            )
          }
          disabled={!filters.classId}
          className="
            rounded-lg
            border
            border-slate-300
            bg-white
            px-3
            py-2
            text-sm
            text-slate-800
            focus:border-indigo-500
            focus:outline-none
            disabled:cursor-not-allowed
            disabled:bg-slate-100
            disabled:text-slate-400
          "
        >
          <option value="">
            {filters.classId
              ? "All Sections"
              : "Select Class First"}
          </option>

          {filteredSections.map(
            (section) => (
              <option
                key={
                  section.section_id
                }
                value={
                  section.section_id
                }
              >
                {
                  section.section_name
                }
              </option>
            )
          )}
        </select>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(event) =>
            handleChange(
              "status",
              event.target.value
            )
          }
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">
            All Status
          </option>

          <option value="Generated">
            Generated
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Cancelled">
            Cancelled
          </option>
        </select>

        {/* Clear */}
        <button
          type="button"
          onClick={clearFilters}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
        >
          <RotateCcw size={16} />
          Clear
        </button>

      </div>
    </div>
  );
};

export default CertificateFilters;