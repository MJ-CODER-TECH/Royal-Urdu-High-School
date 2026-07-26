import { useDispatch } from "react-redux";
import { Sparkles } from "lucide-react";

import {
  generateResult,
  getResultsByFilter,
} from "../../../redux/exam/result/resultThunk";

const ResultGenerateButton = ({
  filters,
  disabled = false,
}) => {
  const dispatch = useDispatch();

  const handleGenerate = async () => {
    if (
      !filters.academic_year_id ||
      !filters.class_id ||
      !filters.section_id ||
      !filters.exam_id
    ) {
      alert("Please select Academic Year, Class, Section and Exam");
      return;
    }

    const response = await dispatch(
      generateResult(filters)
    );

    if (generateResult.fulfilled.match(response)) {
      alert("Result generated successfully");
      dispatch(getResultsByFilter(filters));
    }
  };

  return (
    <button
      type="button"
      onClick={handleGenerate}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
    >
      <Sparkles size={16} />
      Generate Result
    </button>
  );
};

export default ResultGenerateButton;