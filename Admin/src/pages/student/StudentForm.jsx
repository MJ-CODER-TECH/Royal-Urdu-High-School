import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Users,
  GraduationCap,
  MapPin,
  Camera,
  AlertCircle,
} from "lucide-react";

import { createStudent, updateStudent } from "../../redux/student/studentThunk";
import { getClassesApi, getSectionsApi } from "../../api/master.api";

const schema = z.object({
  admissionNo: z.string().min(1, "Admission No is required"),
  penNumber: z.string().optional(),
  grNo: z.string().optional(),
  rollNo: z.string().optional(),

  firstName: z.string().min(1, "First Name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last Name is required"),

  subCaste: z.string().optional(),
  admissionStd: z.string().optional(),

  gender: z.string().min(1, "Gender is required"),
  dob: z.string().min(1, "Date of Birth is required"),
  bloodGroup: z.string().optional(),
  religion: z.string().optional(),
  category: z.string().optional(),
  caste: z.string().optional(),
  nationality: z.string().optional(),
  aadhaarNo: z.string().optional(),

  motherTongue: z.string().optional(),
  placeOfBirth: z.string().optional(),

  mobile: z.string().length(10, "Mobile number must be 10 digits long"),
  email: z.string().min(1, "Email is required").email("Invalid Email"),

  parentMobile: z.string().min(1, "Parent Mobile is required"),
  occupation: z.string().optional(),

  fatherName: z.string().optional(),
  fatherMobile: z.string().optional(),
  fatherOccupation: z.string().optional(),

  motherName: z.string().optional(),
  motherMobile: z.string().optional(),
  motherOccupation: z.string().optional(),

  guardianName: z.string().optional(),
  guardianMobile: z.string().optional(),

  admissionDate: z.string().min(1, "Admission Date is required"),
  previousSchool: z.string().optional(),

  classId: z.string().min(1, "Class is required"),
  sectionId: z.string().min(1, "Section is required"),

  house: z.string().optional(),
  address: z.string().optional(),
  village: z.string().optional(),
  city: z.string().optional(),
  taluka: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  country: z.string().optional(),
  pinCode: z.string().optional(),

  isActive: z.boolean(),
});

const FIELD_KEY_MAP = {
  admissionNo: "admission_no",
  penNumber: "pen_number",
  grNo: "gr_no",
  rollNo: "roll_no",
  firstName: "first_name",
  middleName: "middle_name",
  lastName: "last_name",
  bloodGroup: "blood_group",
  address: "street",
  aadhaarNo: "aadhaar",
  motherTongue: "mother_tongue",
  placeOfBirth: "place_of_birth",
  parentMobile: "parent_mobile",
  fatherMobile: "father_mobile",
  fatherName: "father_name",
  fatherOccupation: "father_occupation",
  motherMobile: "mother_mobile",
  motherName: "mother_name",
  motherOccupation: "mother_occupation",
  guardianMobile: "guardian_mobile",
  guardianName: "guardian_name",
  admissionDate: "admission_date",
  previousSchool: "last_school_attended",
  pinCode: "pincode",
  isActive: "is_active",
  classId: "class_id",
  sectionId: "section_id",
  subCaste: "sub_caste",
  admissionStd: "admission_std",
};

const REVERSE_FIELD_KEY_MAP = Object.entries(FIELD_KEY_MAP).reduce((acc, [camelKey, snakeKey]) => {
  acc[snakeKey] = camelKey;
  return acc;
}, {});

const camelToSnake = (str) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
const snakeToCamel = (str) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const VITE_API_URL = import.meta.env.VITE_API_URL;
// ---- Shared field styles ----
const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";
const errorClass = "mt-1 flex items-center gap-1 text-xs text-red-500";

const FieldError = ({ message }) =>
  message ? (
    <p className={errorClass}>
      <AlertCircle size={12} />
      {message}
    </p>
  ) : null;

const SectionCard = ({ icon: Icon, title, children }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-6 flex items-center gap-2.5">
      <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
        <Icon size={18} />
      </div>
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
    </div>

    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">{children}</div>
  </div>
);

const StudentForm = ({ student, onClose }) => {
  const dispatch = useDispatch();
  const { submitting } = useSelector((state) => state.student);

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const loadMasters = async () => {
      try {
        const [classList, sectionList] = await Promise.all([getClassesApi(), getSectionsApi()]);
        setClasses(classList || []);
        setSections(sectionList || []);
      } catch (error) {
        console.error("Failed to load class/section list:", error);
      }
    };
    loadMasters();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      admissionNo: "",
      penNumber: "",
      grNo: "",
      rollNo: "",
      firstName: "",
      middleName: "",
      lastName: "",
      subCaste: "",
      admissionStd: "",
      gender: "",
      dob: "",
      bloodGroup: "",
      religion: "",
      category: "",
      caste: "",
      nationality: "Indian",
      aadhaarNo: "",
      motherTongue: "",
      placeOfBirth: "",
      mobile: "",
      email: "",
      parentMobile: "",
      fatherName: "",
      fatherMobile: "",
      fatherOccupation: "",
      motherName: "",
      motherMobile: "",
      motherOccupation: "",
      guardianName: "",
      guardianMobile: "",
      admissionDate: "",
      previousSchool: "",
      classId: "",
      sectionId: "",
      house: "",
      address: "",
      village: "",
      city: "",
      taluka: "",
      state: "",
      district: "",
      country: "India",
      pinCode: "",
      isActive: true,
    },
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (!student || classes.length === 0 || sections.length === 0) return;

    const camelData = {};
    Object.entries(student).forEach(([key, value]) => {
      const camelKey = REVERSE_FIELD_KEY_MAP[key] ?? snakeToCamel(key);
      camelData[camelKey] = value ?? "";
    });

    reset({
      ...camelData,
      classId: String(student.class_id ?? ""),
      sectionId: String(student.section_id ?? ""),
      dob: student.dob ? String(student.dob).slice(0, 10) : "",
      admissionDate: student.admission_date ? String(student.admission_date).slice(0, 10) : "",
      isActive: student.status === "Active",
    });

   if (student.photoUrl) {
  setPhotoPreview(student.photoUrl);
} else if (student.photo_path) {
  setPhotoPreview(
    `${VITE_API_URL}/${student.photo_path.replace(/\\/g, "/")}`
  );
} else {
  setPhotoPreview(null);
}

    setPhotoFile(null);
  }, [student, classes, sections, reset]);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const backendKey = FIELD_KEY_MAP[key] ?? camelToSnake(key);
        formData.append(backendKey, value);
      }
    });

    if (photoFile) {
      formData.append("photo", photoFile);
    } else if (student?.photo_path) {
      formData.append("existing_photo_path", student.photo_path);
    }

    if (student) {
      await dispatch(
        updateStudent({ id: student.studentId ?? student.student_id, data: formData }),
      );
    } else {
      await dispatch(createStudent(formData));
    }

    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Photo */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2.5">
          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
            <Camera size={18} />
          </div>
          <h2 className="text-base font-semibold text-slate-900">Student Photo</h2>
        </div>

        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <div className="h-32 w-32 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {photoPreview ? (
              <img src={photoPreview} alt="Student" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-300">
                <User size={36} />
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="photo-upload"
              className="
                inline-flex cursor-pointer items-center gap-2 rounded-lg border
                border-slate-300 px-4 py-2 text-sm font-medium text-slate-700
                transition-colors hover:bg-slate-50
              "
            >
              <Camera size={15} />
              {photoPreview ? "Change Photo" : "Upload Photo"}
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="hidden"
            />
            <p className="mt-2 text-xs text-slate-400">JPG or PNG, max 2MB</p>
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <SectionCard icon={User} title="Personal Details">
        <div>
          <label className={labelClass}>Admission No</label>
          <input {...register("admissionNo")} className={inputClass} />
          <FieldError message={errors.admissionNo?.message} />
        </div>

        <div>
          <label className={labelClass}>PEN Number</label>
          <input {...register("penNumber")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>GR No</label>
          <input {...register("grNo")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Roll No</label>
          <input {...register("rollNo")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>First Name</label>
          <input {...register("firstName")} className={inputClass} />
          <FieldError message={errors.firstName?.message} />
        </div>

        <div>
          <label className={labelClass}>Middle Name</label>
          <input {...register("middleName")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Last Name</label>
          <input {...register("lastName")} className={inputClass} />
          <FieldError message={errors.lastName?.message} />
        </div>

        <div>
          <label className={labelClass}>Gender</label>
          <select {...register("gender")} className={inputClass}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <FieldError message={errors.gender?.message} />
        </div>

        <div>
          <label className={labelClass}>Date of Birth</label>
          <input type="date" {...register("dob")} className={inputClass} />
          <FieldError message={errors.dob?.message} />
        </div>

        <div>
          <label className={labelClass}>Place of Birth</label>
          <input {...register("placeOfBirth")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Blood Group</label>
          <select {...register("bloodGroup")} className={inputClass}>
            <option value="">Select</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
            <option>O+</option>
            <option>O-</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Religion</label>
          <input {...register("religion")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <input {...register("category")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Sub Caste</label>
          <input {...register("subCaste")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Caste</label>
          <input {...register("caste")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Nationality</label>
          <input {...register("nationality")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Mother Tongue</label>
          <input {...register("motherTongue")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Aadhaar No</label>
          <input {...register("aadhaarNo")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Mobile</label>
          <input {...register("mobile")} className={inputClass} />
          <FieldError message={errors.mobile?.message} />
        </div>

        <div>
          <label className={labelClass}>Email</label>
          <input type="email" {...register("email")} className={inputClass} />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <label className={labelClass}>Parent Mobile</label>
          <input {...register("parentMobile")} className={inputClass} />
          <FieldError message={errors.parentMobile?.message} />
        </div>
      </SectionCard>

      {/* Parent / Guardian Details */}
      <SectionCard icon={Users} title="Parent / Guardian Details">
        <div>
          <label className={labelClass}>Father's Name</label>
          <input {...register("fatherName")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Father's Mobile</label>
          <input {...register("fatherMobile")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Father's Occupation</label>
          <input {...register("fatherOccupation")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Mother's Name</label>
          <input {...register("motherName")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Mother's Mobile</label>
          <input {...register("motherMobile")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Mother's Occupation</label>
          <input {...register("motherOccupation")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Guardian's Name</label>
          <input {...register("guardianName")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Guardian's Mobile</label>
          <input {...register("guardianMobile")} className={inputClass} />
        </div>
      </SectionCard>

      {/* Academic Details */}
      <SectionCard icon={GraduationCap} title="Academic Details">
        <div>
          <label className={labelClass}>Class</label>
          <select {...register("classId")} className={inputClass}>
            <option value="">Select</option>
            {classes.map((c) => (
              <option key={c.class_id} value={c.class_id}>
                {c.class_name}
              </option>
            ))}
          </select>
          <FieldError message={errors.classId?.message} />
        </div>

        <div>
          <label className={labelClass}>Section</label>
          <select {...register("sectionId")} className={inputClass}>
            <option value="">Select</option>
            {sections.map((section) => (
              <option key={section.section_id} value={section.section_id}>
                {section.class_name} - {section.section_name}
              </option>
            ))}
          </select>
          <FieldError message={errors.sectionId?.message} />
        </div>

        <div>
          <label className={labelClass}>Admission Date</label>
          <input type="date" {...register("admissionDate")} className={inputClass} />
          <FieldError message={errors.admissionDate?.message} />
        </div>

        <div>
          <label className={labelClass}>Previous School</label>
          <input {...register("previousSchool")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Admission Std</label>
          <input {...register("admissionStd")} className={inputClass} />
        </div>
      </SectionCard>

      {/* Address Details */}
      <SectionCard icon={MapPin} title="Address Details">
        <div>
          <label className={labelClass}>House / Flat No</label>
          <input {...register("house")} className={inputClass} />
        </div>

        <div className="md:col-span-2 lg:col-span-2">
          <label className={labelClass}>Street / Address</label>
          <input {...register("address")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Village</label>
          <input {...register("village")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>City</label>
          <input {...register("city")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Taluka</label>
          <input {...register("taluka")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>District</label>
          <input {...register("district")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>State</label>
          <input {...register("state")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Country</label>
          <input {...register("country")} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Pin Code</label>
          <input {...register("pinCode")} className={inputClass} />
        </div>

        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            {...register("isActive")}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-200"
          />
          <span className="text-sm font-medium text-slate-700">Active Student</span>
        </div>
      </SectionCard>

      {/* Footer */}
      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="
            rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white
            shadow-sm transition-colors hover:bg-indigo-700
            disabled:cursor-not-allowed disabled:opacity-60
          "
        >
          {submitting ? "Saving..." : student ? "Update Student" : "Create Student"}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;