import React from "react";
import {
  FileText,
  Download,
  Printer,
  Calendar,
  User,
  GraduationCap,
  Award,
} from "lucide-react";

const CertificatePreview = ({
  certificate,
  onDownload,
  onPrint,
}) => {
  if (!certificate) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <FileText size={56} className="mb-3 text-slate-300" />
        <h3 className="text-base font-semibold text-slate-700">
          No Certificate Selected
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Select a certificate from the table to preview details.
        </p>
      </div>
    );
  }

  const handlePrintAction = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs">
      {/* Header Controls (Hidden on Print) */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 print:hidden">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Certificate Preview
          </h2>
          <p className="text-xs text-slate-500">
            Review certificate content prior to issuing or printing.
          </p>
        </div>

        <div className="flex gap-2">
          {onDownload && (
            <button
              type="button"
              onClick={onDownload}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-2xs hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <Download size={16} />
              Download
            </button>
          )}

          <button
            type="button"
            onClick={handlePrintAction}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Printer size={16} />
            Print
          </button>
        </div>
      </div>

      {/* Certificate Paper Frame */}
      <div className="p-8 print:p-0">
        <div className="relative rounded-lg border-2 border-slate-200 bg-slate-50/30 p-8 shadow-2xs print:border-none print:shadow-none">
          {/* Top School Header */}
          <div className="text-center">
            <h1 className="text-2xl font-extrabold uppercase tracking-wide text-slate-900">
              {certificate.school_name || "Institution Name"}
            </h1>
            {certificate.school_address && (
              <p className="mt-1 text-xs text-slate-600">
                {certificate.school_address}
              </p>
            )}
          </div>

          <div className="my-6 flex items-center justify-center gap-2">
            <div className="h-2px w-16 bg-indigo-500/30" />
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200">
              {certificate.certificate_type || "Certificate"}
            </span>
            <div className="h-2px w-16 bg-indigo-500/30" />
          </div>

          {/* Student & Issue Details */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                <User size={18} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase">
                  Student Name
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {certificate.student_name || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                <GraduationCap size={18} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase">
                  Class & Section
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {certificate.class_name || "—"} {certificate.section_name || ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase">
                  Issue Date
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {certificate.issue_date || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Reason Block */}
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="mb-2 text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Reason / Statement
            </h3>
            <p className="text-sm leading-relaxed text-slate-700">
              {certificate.reason || "No explicit reason specified for issuance."}
            </p>

            {certificate.remarks && (
              <div className="mt-4 border-t border-slate-100 pt-3">
                <h4 className="text-xs font-semibold uppercase text-slate-400">
                  Remarks
                </h4>
                <p className="mt-1 text-xs text-slate-600">
                  {certificate.remarks}
                </p>
              </div>
            )}
          </div>

          {/* Signature Footer (Visible on Print/Formal view) */}
          <div className="mt-12 flex items-end justify-between pt-6 text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-700">
                Cert No: {certificate.certificate_no || "N/A"}
              </p>
              <p>Generated by: {certificate.generated_by || "System Admin"}</p>
            </div>
            <div className="text-center">
              <div className="mb-1 h-8 w-32 border-b border-dashed border-slate-400"></div>
              <p className="font-medium text-slate-700">Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview;