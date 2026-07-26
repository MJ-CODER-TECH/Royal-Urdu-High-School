import { useEffect } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { fetchClasses } from "../../redux/master/classMasterThunk";
import { fetchSections } from "../../redux/section/sectionThunk";

const selectClass =
  "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

const StudentFilters = ({
  search,
  setSearch,
  classId,
  setClassId,
  sectionId,
  setSectionId,
  status,
  setStatus,
}) => {
  const dispatch = useDispatch();

  const { classes } = useSelector((state) => state.classMaster);
  const { sections } = useSelector((state) => state.section);

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchSections());
  }, [dispatch]);

  const hasActiveFilters = search || classId || sectionId || status;

  const clearFilters = () => {
    setSearch("");
    setClassId("");
    setSectionId("");
    setStatus("");
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <SlidersHorizontal size={16} className="text-slate-400" />
          Filters
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 transition-colors hover:text-red-600"
          >
            <X size={14} />
            Clear all
          </button>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, admission no..."
            className={`w-full pl-9 ${selectClass}`}
          />
        </div>

        {/* Class */}
        <select value={classId} onChange={(e) => setClassId(e.target.value)} className={selectClass}>
          <option value="">All Classes</option>
          {(classes || []).map((item) => (
            <option key={item.class_id} value={item.class_id}>
              {item.class_name}
            </option>
          ))}
        </select>

      {/* Section */}
<select
  value={sectionId}
  onChange={(e) => setSectionId(e.target.value)}
  className={selectClass}
>
  <option value="">All Sections</option>

  {(sections || []).map((item) => (
    <option key={item.section_id} value={item.section_id}>
      {item.class_name} - {item.section_name}
    </option>
  ))}
</select>

        {/* Status */}
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </div>
  );
};

export default StudentFilters;