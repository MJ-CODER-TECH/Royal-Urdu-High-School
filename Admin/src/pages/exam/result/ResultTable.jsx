import React from "react";

const ResultTable = ({ results = [], loading }) => {
  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        Loading results...
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        No result found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full border-collapse text-left text-sm text-gray-700">
        <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-700">
          <tr>
            <th className="px-4 py-3 font-semibold">#</th>
            <th className="px-4 py-3 font-semibold">Roll No</th>
            <th className="px-4 py-3 font-semibold">Student Name</th>
            <th className="px-4 py-3 text-center font-semibold">Total Marks</th>
            <th className="px-4 py-3 text-center font-semibold">Obtained Marks</th>
            <th className="px-4 py-3 text-center font-semibold">Percentage</th>
            <th className="px-4 py-3 text-center font-semibold">Grade</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {results.map((item, index) => {
            const grade = item.grade;
            let badgeStyle = "bg-gray-100 text-gray-700";

            if (grade === "F" || grade === "Fail") {
              badgeStyle = "bg-red-100 text-red-700";
            } else if (grade) {
              badgeStyle = "bg-green-100 text-green-700";
            }

            return (
              <tr key={item.result_id || item.student_id || index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-500">
                  {index + 1}
                </td>

                <td className="px-4 py-3 font-medium text-gray-900">
                  {item.roll_no || "-"}
                </td>

                <td className="px-4 py-3 text-gray-900">
                  {item.student_name || "-"}
                </td>

                <td className="px-4 py-3 text-center">
                  {item.total_marks ?? 0}
                </td>

                <td className="px-4 py-3 text-center font-semibold text-gray-900">
                  {item.obtained_marks ?? 0}
                </td>

                <td className="px-4 py-3 text-center">
                  {item.percentage !== undefined && item.percentage !== null && item.percentage !== ""
                    ? `${Number(item.percentage).toFixed(2)}%`
                    : "-"}
                </td>

                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-3 py-0.5 text-xs font-semibold ${badgeStyle}`}
                  >
                    {grade || "-"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;