import {
    Printer,
    FileText,
    FileSpreadsheet,
} from "lucide-react";

const ReportActions = ({
    exporting = false,
    onPrint,
    onPdf,
    onExcel,
}) => {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <button
                type="button"
                onClick={onPrint}
                disabled={exporting}
                className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
                <Printer size={16} className="text-gray-500" />
                Print
            </button>

            <button
                type="button"
                onClick={onPdf}
                disabled={exporting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
                <FileText size={16} />
                Export PDF
            </button>

            <button
                type="button"
                onClick={onExcel}
                disabled={exporting}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
                <FileSpreadsheet size={16} />
                Export Excel
            </button>
        </div>
    );
};

export default ReportActions;