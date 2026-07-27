import { X, User, Loader2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/api\/v\d+\/?$/, "");
const Field = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-0.5 text-sm text-slate-800">{value || value === 0 ? value : "-"}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="mb-5 text-base font-semibold text-slate-900">{title}</h2>
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">{children}</div>
  </div>
);

const StudentView = ({ open, onClose, student, loading }) => {
  if (!open) return null;

  const fullName = student
    ? [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(" ")
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
              {student?.photo_path ? (
                <img
    src={`${API_BASE_URL}/${student.photo_path.replace(/\\/g, "/")}`}
                            alt={fullName}
                            className="h-full w-full object-cover"
                          />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-400">
                  <User size={22} />
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {loading ? "Loading..." : fullName || "Student"}
              </h2>
              <p className="text-sm text-slate-500">
                Admission No: {student?.admission_no || "-"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-16 text-slate-500">
            <Loader2 size={20} className="animate-spin" />
            Loading student details...
          </div>
        ) : !student ? (
          <div className="p-16 text-center text-slate-500">No student data found.</div>
        ) : (
          <div className="space-y-6 p-6">
            <Section title="Personal Details">
              <Field label="Admission No" value={student.admission_no} />
              <Field label="PEN Number" value={student.pen_number} />
              <Field label="GR No" value={student.gr_no} />
              <Field label="Roll No" value={student.roll_no} />
              <Field label="First Name" value={student.first_name} />
              <Field label="Middle Name" value={student.middle_name} />
              <Field label="Last Name" value={student.last_name} />
              <Field label="Gender" value={student.gender} />
              <Field label="Date of Birth" value={student.dob} />
              <Field label="Blood Group" value={student.blood_group} />
              <Field label="Religion" value={student.religion} />
              <Field label="Category" value={student.category} />
              <Field label="Caste" value={student.caste} />
              <Field label="Nationality" value={student.nationality} />
              <Field label="Aadhaar No" value={student.aadhaar} />
              <Field label="Mobile" value={student.mobile} />
              <Field label="Email" value={student.email} />
            </Section>

            <Section title="Parent / Guardian Details">
              <Field label="Father Name" value={student.father_name} />
              <Field label="Mother Name" value={student.mother_name} />
              <Field label="Guardian Name" value={student.guardian_name} />
              <Field
                label="Father Occupation"
                value={student.occupation || student.father_occupation || student.mother_occupation}
              />
              <Field label="Parent Mobile" value={student.parent_mobile} />
              <Field label="Parent Email" value={student.parent_email} />
              <Field label="Relation" value={student.relation} />
            </Section>

            <Section title="Academic Details">
              <Field label="Admission Date" value={student.admission_date} />
              <Field label="Previous School" value={student.last_school_attended} />
              <Field label="Class" value={student.class_name || student.class_id} />
              <Field label="Section" value={student.section_name || student.section_id} />
              <Field label="Status" value={student.status} />
            </Section>

            <Section title="Address Details">
              <Field label="House" value={student.house} />
              <Field label="Street" value={student.street} />
              <Field label="Village" value={student.village} />
              <Field label="City" value={student.city} />
              <Field label="Taluka" value={student.taluka} />
              <Field label="District" value={student.district} />
              <Field label="State" value={student.state} />
              <Field label="Country" value={student.country} />
              <Field label="Pin Code" value={student.pincode} />
            </Section>
          </div>
        )}

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end border-t border-slate-100 bg-white px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentView;