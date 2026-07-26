import React from "react";

const MarksTable = ({
  loading,
  marks = [],
  onChange,
}) => {

  const handleObtainedChange = (index, value) => {
    const updatedMarks = marks.map((row, i) => {
      if (i === index) {
        return {
          ...row,
          obtained_marks: value,
        };
      }
      return row;
    });

    onChange?.(updatedMarks);
  };

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full border-collapse text-left text-sm text-gray-700">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="border-b border-r px-4 py-3">Roll No</th>
            <th className="border-b border-r px-4 py-3">Student</th>
            <th className="border-b border-r px-4 py-3">Max Marks</th>
            <th className="border-b border-r px-4 py-3">Obtained Marks</th>
            <th className="border-b px-4 py-3">Grade</th>
          </tr>
        </thead>
        <tbody>
          {(!marks || marks.length === 0) && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-gray-500">
                No students found.
              </td>
            </tr>
          )}

          {marks.map((item, index) => {
            const maxMarks = Number(item.max_marks) || 0;

            return (
              <tr key={item.student_id || index} className="hover:bg-gray-50">
                <td className="border-b border-r px-4 py-2.5 font-medium">
                  {item.roll_no}
                </td>

                <td className="border-b border-r px-4 py-2.5">
                  {item.student_name}
                </td>

                <td className="border-b border-r px-4 py-2.5">
                  {item.max_marks ?? ""}
                </td>

                <td className="border-b border-r px-4 py-2.5">
                  <input
                    type="number"
                    min={0}
                    max={maxMarks}
                    value={item.obtained_marks ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Handle empty string correctly vs numeric value
                      const parsedVal = val === "" ? "" : Number(val);
                      handleObtainedChange(index, parsedVal);
                    }}
                    className="w-28 rounded border border-gray-300 px-2.5 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </td>

                <td className="border-b px-4 py-2.5 font-semibold text-gray-800">
                  {item.grade || "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MarksTable;