import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import {
  generateBonafide,
  generateTC,
  generateLC,
  generateCharacter,
} from "../../redux/certificate/certificateThunk";

import { getStudentsApi } from "../../api/student.api";
import { getClassesApi, getSectionsApi } from "../../api/master.api";

const schema = z.object({
  studentId: z.string().min(1, "Student selection is required"),
  certificateType: z.string().min(1, "Certificate Type is required"),
  issueDate: z.string().min(1, "Issue Date is required"),
  reason: z.string().min(1, "Reason is required"),
  remarks: z.string().optional(),
  indexNumber: z.string().optional(),
  status: z.string().min(1, "Status is required"),
});

const TYPE_ACTION_MAP = {
  Bonafide: (studentId, payload) => generateBonafide(studentId),
  "Transfer Certificate": (studentId, payload) => generateTC(studentId, payload),
  "Leaving Certificate": (studentId, payload) => generateLC(studentId, payload),
  "Character Certificate": (studentId, payload) => generateCharacter(studentId, payload),
};

const CertificateForm = ({ certificate, onClose }) => {
  const dispatch = useDispatch();
  const { submitting } = useSelector((state) => state.certificate || {});

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      studentId: "",
      certificateType: "Bonafide",
      issueDate: new Date().toISOString().slice(0, 10),
      reason: "",
      remarks: "",
      indexNumber: "",
      status: "Generated",
    },
  });

  useEffect(() => {
    const loadMasters = async () => {
      try {
        const [classList, sectionList] = await Promise.all([
          getClassesApi(),
          getSectionsApi(),
        ]);
        setClasses(classList || []);
        setSections(sectionList || []);
      } catch (err) {
        console.error("Failed to load classes/sections", err);
      }
    };
    loadMasters();
  }, []);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await getStudentsApi({
          classId,
          sectionId,
          status: "Active",
          page: 1,
          limit: 500,
        });
        setStudents(res.students || res.data || []);
      } catch (err) {
        console.error("Failed to load students", err);
        setStudents([]);
      }
    };
    loadStudents();
  }, [classId, sectionId]);

  useEffect(() => {
    if (!certificate) return;

    if (certificate.class_id) setClassId(String(certificate.class_id));
    if (certificate.section_id) setSectionId(String(certificate.section_id));

    reset({
      studentId: String(certificate.student_id || ""),
      certificateType: certificate.certificate_type || "Bonafide",
      issueDate: certificate.issue_date ? String(certificate.issue_date).slice(0, 10) : "",
      reason: certificate.reason || "",
      remarks: certificate.remarks || "",
      indexNumber: certificate.index_no || "",
      status: certificate.status || "Generated",
    });
  }, [certificate, reset]);

  const onSubmit = async (data) => {
    const actionCreator = TYPE_ACTION_MAP[data.certificateType];
    if (!actionCreator) {
      alert("Invalid certificate type selection.");
      return;
    }

    const payload = {
      reason: data.reason,
      remarks: data.remarks,
      index_no: data.indexNumber,
      status: data.status,
    };

    await dispatch(actionCreator(data.studentId, payload));
    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Student Details */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <h2 className="mb-4 text-base font-semibold text-slate-800">Student Filter & Selection</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Class</label>
            <select
              value={classId}
              onChange={(e) => {
                setClassId(e.target.value);
                setSectionId("");
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
            >
              <option value="">All Classes</option>
              {classes.map((item) => (
                <option key={item.class_id} value={item.class_id}>
                  {item.class_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Section</label>
            <select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
            >
              <option value="">All Sections</option>
              {sections.map((sec) => (
                <option key={sec.section_id} value={sec.section_id}>
                  {sec.class_name ? `${sec.class_name} - ` : ""}{sec.section_name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-700">Select Student *</label>
            <select
              {...register("studentId")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
            >
              <option value="">Select Student</option>
              {students.map((st) => {
                const name = [st.first_name, st.middle_name, st.last_name].filter(Boolean).join(" ");
                return (
                  <option key={st.student_id} value={st.student_id}>
                    {st.admission_no} - {name}
                  </option>
                );
              })}
            </select>
            {errors.studentId && (
              <p className="mt-1 text-xs text-rose-500">{errors.studentId.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Certificate Meta Details */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <h2 className="mb-4 text-base font-semibold text-slate-800">Certificate Information</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Certificate Type *</label>
            <select
              {...register("certificateType")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
            >
              <option value="Bonafide">Bonafide</option>
              <option value="Transfer Certificate">Transfer Certificate</option>
              <option value="Leaving Certificate">Leaving Certificate</option>
              <option value="Character Certificate">Character Certificate</option>
            </select>
            {errors.certificateType && (
              <p className="mt-1 text-xs text-rose-500">{errors.certificateType.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Issue Date *</label>
            <input
              type="date"
              {...register("issueDate")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
            />
            {errors.issueDate && (
              <p className="mt-1 text-xs text-rose-500">{errors.issueDate.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Status *</label>
            <select
              {...register("status")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
            >
              <option value="Generated">Generated</option>
              <option value="Pending">Pending</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Index Number (Optional)</label>
            <input
              type="text"
              placeholder="e.g. IND-1029"
              {...register("indexNumber")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-700">Reason *</label>
            <textarea
              rows={2}
              placeholder="Specify the reason for issuing..."
              {...register("reason")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
            />
            {errors.reason && (
              <p className="mt-1 text-xs text-rose-500">{errors.reason.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-700">Remarks (Optional)</label>
            <textarea
              rows={2}
              placeholder="Additional notes or remarks..."
              {...register("remarks")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {certificate ? "Update Certificate" : "Generate Certificate"}
        </button>
      </div>
    </form>
  );
};

export default CertificateForm;