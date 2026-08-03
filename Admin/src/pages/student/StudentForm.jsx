import { useEffect, useMemo, useState } from "react";
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

import {
  createStudent,
  updateStudent,
} from "../../redux/student/studentThunk";

import {
  getClassesApi,
  getSectionsApi,
  getAcademicYearsApi,
} from "../../api/master.api";


/*
|--------------------------------------------------------------------------
| Validation Schema
|--------------------------------------------------------------------------
*/

const schema = z.object({
  admissionNo: z
    .string()
    .min(1, "Admission No is required"),

  penNumber: z.string().optional(),
  grNo: z.string().optional(),
  rollNo: z.string().optional(),

  firstName: z
    .string()
    .min(1, "First Name is required"),

  middleName: z.string().optional(),

  lastName: z
    .string()
    .min(1, "Last Name is required"),

  subCaste: z.string().optional(),
  admissionStd: z.string().optional(),

  gender: z
    .string()
    .min(1, "Gender is required"),

  dob: z
    .string()
    .min(1, "Date of Birth is required"),

  bloodGroup: z.string().optional(),
  religion: z.string().optional(),
  category: z.string().optional(),
  caste: z.string().optional(),
  nationality: z.string().optional(),
  aadhaarNo: z.string().optional(),

  motherTongue: z.string().optional(),
  placeOfBirth: z.string().optional(),

  mobile: z
    .string()
    .length(10, "Mobile number must be 10 digits long"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid Email"),

  parentMobile: z
    .string()
    .min(1, "Parent Mobile is required"),

  occupation: z.string().optional(),

  fatherName: z.string().optional(),
  fatherMobile: z.string().optional(),
  fatherOccupation: z.string().optional(),

  motherName: z.string().optional(),
  motherMobile: z.string().optional(),
  motherOccupation: z.string().optional(),

  guardianName: z.string().optional(),
  guardianMobile: z.string().optional(),

  admissionDate: z
    .string()
    .min(1, "Admission Date is required"),

  previousSchool: z.string().optional(),

  academicYearId: z
    .string()
    .min(1, "Academic Year is required"),

  classId: z
    .string()
    .min(1, "Class is required"),

  sectionId: z
    .string()
    .min(1, "Section is required"),

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


/*
|--------------------------------------------------------------------------
| Frontend Key -> Backend Key
|--------------------------------------------------------------------------
*/

const FIELD_KEY_MAP = {
  admissionNo: "admission_no",
  penNumber: "pen_number",
  grNo: "gr_no",
  rollNo: "roll_no",

  firstName: "first_name",
  middleName: "middle_name",
  lastName: "last_name",

  subCaste: "sub_caste",
  admissionStd: "admission_std",

  bloodGroup: "blood_group",

  address: "street",

  aadhaarNo: "aadhaar",

  motherTongue: "mother_tongue",
  placeOfBirth: "place_of_birth",

  parentMobile: "parent_mobile",

  fatherName: "father_name",
  fatherMobile: "father_mobile",
  fatherOccupation: "father_occupation",

  motherName: "mother_name",
  motherMobile: "mother_mobile",
  motherOccupation: "mother_occupation",

  guardianName: "guardian_name",
  guardianMobile: "guardian_mobile",

  admissionDate: "admission_date",

  previousSchool: "last_school_attended",

  academicYearId: "academic_year_id",

  classId: "class_id",

  sectionId: "section_id",

  pinCode: "pincode",

  isActive: "is_active",
};


const REVERSE_FIELD_KEY_MAP = Object.entries(
  FIELD_KEY_MAP
).reduce(
  (result, [camelKey, snakeKey]) => {
    result[snakeKey] = camelKey;
    return result;
  },
  {}
);


const camelToSnake = (value) => {
  return value.replace(
    /[A-Z]/g,
    (letter) => `_${letter.toLowerCase()}`
  );
};


const snakeToCamel = (value) => {
  return value.replace(
    /_([a-z])/g,
    (_, letter) => letter.toUpperCase()
  );
};


const VITE_API_URL =
  import.meta.env.VITE_API_URL || "";


/*
|--------------------------------------------------------------------------
| Styles
|--------------------------------------------------------------------------
*/

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";


const labelClass =
  "mb-1.5 block text-sm font-medium text-slate-700";


const errorClass =
  "mt-1 flex items-center gap-1 text-xs text-red-500";


/*
|--------------------------------------------------------------------------
| Helpers: Robust Display-Name Resolvers
|--------------------------------------------------------------------------
| The master-data APIs (academic years / classes / sections) don't always
| return the same key names. These helpers try every reasonable key name
| before falling back to a safe, non-blank placeholder, so the dropdowns
| never render an empty "-" like before.
|--------------------------------------------------------------------------
*/

const formatYearFromDate = (dateValue) => {

  if (!dateValue) {
    return null;
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.getFullYear();

};


const getAcademicYearLabel = (year, fallbackId) => {

  const directLabel =

    year.year_label ??
    year.yearLabel ??
    year.academic_year ??
    year.academicYear ??
    year.year_name ??
    year.yearName ??
    year.academic_year_name ??
    year.academicYearName ??
    year.name ??
    year.title ??
    year.label ??
    null;

  if (
    directLabel !== null &&
    directLabel !== undefined &&
    String(directLabel).trim() !== ""
  ) {
    return String(directLabel);
  }

  const startYear =

    year.year_start ??
    year.yearStart ??
    year.start_year ??
    year.startYear ??
    formatYearFromDate(
      year.start_date ?? year.startDate
    );

  const endYear =

    year.year_end ??
    year.yearEnd ??
    year.end_year ??
    year.endYear ??
    formatYearFromDate(
      year.end_date ?? year.endDate
    );

  if (startYear && endYear) {
    return `${startYear}-${endYear}`;
  }

  if (startYear) {
    return String(startYear);
  }

  // Nothing usable came back from the API — show a safe placeholder
  // instead of a blank "-" so the issue is obvious and the option
  // is still selectable.
  return `Academic Year #${fallbackId}`;

};


const getClassLabel = (classItem, fallbackId) => {

  const label =

    classItem.class_name ??
    classItem.className ??
    classItem.name ??
    classItem.title ??
    classItem.label ??
    null;

  if (
    label !== null &&
    label !== undefined &&
    String(label).trim() !== ""
  ) {
    return String(label);
  }

  return `Class #${fallbackId}`;

};


const getSectionLabel = (section, fallbackId) => {

  const label =

    section.section_name ??
    section.sectionName ??
    section.name ??
    section.title ??
    section.label ??
    null;

  if (
    label !== null &&
    label !== undefined &&
    String(label).trim() !== ""
  ) {
    return String(label);
  }

  return `Section #${fallbackId}`;

};


/*
|--------------------------------------------------------------------------
| Error Component
|--------------------------------------------------------------------------
*/

const FieldError = ({
  message,
}) => {

  if (!message) {
    return null;
  }

  return (
    <p className={errorClass}>

      <AlertCircle size={12} />

      {message}

    </p>
  );

};


/*
|--------------------------------------------------------------------------
| Section Card
|--------------------------------------------------------------------------
*/

const SectionCard = ({
  icon: Icon,
  title,
  children,
}) => {

  return (

    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-2.5">

        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">

          <Icon size={18} />

        </div>

        <h2 className="text-base font-semibold text-slate-900">

          {title}

        </h2>

      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

        {children}

      </div>

    </div>

  );

};


/*
|--------------------------------------------------------------------------
| Student Form
|--------------------------------------------------------------------------
*/

const StudentForm = ({
  student,
  onClose,
}) => {

  const dispatch = useDispatch();


  const {
    submitting,
  } = useSelector(
    (state) => state.student
  );


  const [
    academicYears,
    setAcademicYears,
  ] = useState([]);


  const [
    classes,
    setClasses,
  ] = useState([]);


  const [
    sections,
    setSections,
  ] = useState([]);


  const [
    selectedClassId,
    setSelectedClassId,
  ] = useState("");


  const [
    photoFile,
    setPhotoFile,
  ] = useState(null);


  const [
    photoPreview,
    setPhotoPreview,
  ] = useState(null);


  /*
  |--------------------------------------------------------------------------
  | React Hook Form
  |--------------------------------------------------------------------------
  */

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,

    formState: {
      errors,
    },

  } = useForm({

    resolver:
      zodResolver(schema),

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
      occupation: "",

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

      academicYearId: "",

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


  const watchedClassId =
    watch("classId");


  /*
  |--------------------------------------------------------------------------
  | Load Academic Years, Classes And Sections
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const loadMasters =
      async () => {

        try {

          const [
            academicYearList,
            classList,
            sectionList,
          ] = await Promise.all([

            getAcademicYearsApi(),

            getClassesApi(),

            getSectionsApi(),

          ]);


          console.log(
            "Academic Years:",
            academicYearList
          );


          console.log(
            "Classes:",
            classList
          );


          console.log(
            "Sections:",
            sectionList
          );


          setAcademicYears(

            Array.isArray(
              academicYearList
            )

              ? academicYearList

              : []

          );


          setClasses(

            Array.isArray(
              classList
            )

              ? classList

              : []

          );


          setSections(

            Array.isArray(
              sectionList
            )

              ? sectionList

              : []

          );

        }

        catch (error) {

          console.error(
            "Failed to load master data:",
            error
          );


          setAcademicYears([]);

          setClasses([]);

          setSections([]);

        }

      };


    loadMasters();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Filter Sections By Selected Class
  |--------------------------------------------------------------------------
  */

  const filteredSections =
    useMemo(() => {

      if (!watchedClassId) {
        return [];
      }


      return sections.filter(
        (section) => {

          return String(

            section.class_id
            ??
            section.classId

          ) === String(
            watchedClassId
          );

        }
      );

    }, [
      sections,
      watchedClassId,
    ]);


  /*
  |--------------------------------------------------------------------------
  | Handle Class Change
  |--------------------------------------------------------------------------
  */

  const handleClassChange =
    (event) => {

      const newClassId =
        event.target.value;


      setSelectedClassId(
        newClassId
      );


      setValue(
        "classId",
        newClassId,
        {
          shouldValidate: true,
        }
      );


      setValue(
        "sectionId",
        "",
        {
          shouldValidate: true,
        }
      );

    };


  /*
  |--------------------------------------------------------------------------
  | Load Student Data In Edit Mode
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (
      !student ||
      academicYears.length === 0 ||
      classes.length === 0 ||
      sections.length === 0
    ) {
      return;
    }


    const camelData = {};


    Object.entries(
      student
    ).forEach(
      ([key, value]) => {

        const camelKey =

          REVERSE_FIELD_KEY_MAP[
            key
          ]

          ??

          snakeToCamel(
            key
          );


        camelData[
          camelKey
        ] =

          value
          ??
          "";

      }
    );


    const studentAcademicYearId =

      String(

        student.academic_year_id

        ??

        student.academicYearId

        ??

        ""

      );


    const studentClassId =

      String(

        student.class_id

        ??

        student.classId

        ??

        ""

      );


    const studentSectionId =

      String(

        student.section_id

        ??

        student.sectionId

        ??

        ""

      );


    reset({

      ...camelData,

      academicYearId:
        studentAcademicYearId,

      classId:
        studentClassId,

      sectionId:
        studentSectionId,

      dob:

        student.dob

          ?

          String(
            student.dob
          ).slice(
            0,
            10
          )

          :

          "",

      admissionDate:

        student.admission_date

          ?

          String(
            student.admission_date
          ).slice(
            0,
            10
          )

          :

          "",

      isActive:

        student.status === "Active"

        ||

        student.is_active === 1

        ||

        student.is_active === true,

    });


    setSelectedClassId(
      studentClassId
    );


    if (
      student.photoUrl
    ) {

      setPhotoPreview(
        student.photoUrl
      );

    }

    else if (
      student.photo_path
    ) {

      const photoPath =

        String(
          student.photo_path
        ).replace(
          /\\/g,
          "/"
        );


      const cleanBaseUrl =

        VITE_API_URL.replace(
          /\/$/,
          ""
        );


      setPhotoPreview(

        `${cleanBaseUrl}/${photoPath.replace(
          /^\//,
          ""
        )}`

      );

    }

    else {

      setPhotoPreview(
        null
      );

    }


    setPhotoFile(
      null
    );

  }, [
    student,
    academicYears,
    classes,
    sections,
    reset,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Create Mode Reset
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (student) {
      return;
    }


    setSelectedClassId("");

    setPhotoFile(null);

    setPhotoPreview(null);

  }, [
    student,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Photo Change
  |--------------------------------------------------------------------------
  */

  const handlePhoto =
    (event) => {

      const file =
        event.target.files?.[0];


      if (!file) {
        return;
      }


      if (
        !file.type.startsWith(
          "image/"
        )
      ) {

        alert(
          "Please select a valid image."
        );

        event.target.value =
          "";

        return;

      }


      if (
        file.size >
        2 * 1024 * 1024
      ) {

        alert(
          "Photo size must be less than 2MB."
        );

        event.target.value =
          "";

        return;

      }


      setPhotoFile(
        file
      );


      setPhotoPreview(

        URL.createObjectURL(
          file
        )

      );

    };


  /*
  |--------------------------------------------------------------------------
  | Submit Form
  |--------------------------------------------------------------------------
  */

  const onSubmit =
    async (data) => {

      const formData =
        new FormData();


      Object.entries(
        data
      ).forEach(
        ([key, value]) => {

          if (
            value === undefined ||
            value === null
          ) {
            return;
          }


          const backendKey =

            FIELD_KEY_MAP[
              key
            ]

            ??

            camelToSnake(
              key
            );


          if (
            key === "isActive"
          ) {

            formData.append(

              backendKey,

              value
                ? "1"
                : "0"

            );

            return;

          }


          formData.append(

            backendKey,

            String(
              value
            )

          );

        }
      );


      if (
        photoFile
      ) {

        formData.append(
          "photo",
          photoFile
        );

      }

      else if (
        student?.photo_path
      ) {

        formData.append(

          "existing_photo_path",

          student.photo_path

        );

      }


      try {

        if (
          student
        ) {

          const studentId =

            student.studentId

            ??

            student.student_id;


          await dispatch(

            updateStudent({

              id:
                studentId,

              data:
                formData,

            })

          ).unwrap();

        }

        else {

          await dispatch(

            createStudent(
              formData
            )

          ).unwrap();

        }


        if (
          onClose
        ) {

          onClose();

        }

      }

      catch (error) {

        console.error(
          "Student save failed:",
          error
        );


        alert(

          typeof error === "string"

            ?

            error

            :

            error?.message

            ??

            "Failed to save student."

        );

      }

    };


  /*
  |--------------------------------------------------------------------------
  | JSX
  |--------------------------------------------------------------------------
  */

  return (

    <form

      onSubmit={
        handleSubmit(
          onSubmit
        )
      }

      className="space-y-6"

    >


      {/* Student Photo */}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-2.5">

          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">

            <Camera size={18} />

          </div>

          <h2 className="text-base font-semibold text-slate-900">

            Student Photo

          </h2>

        </div>


        <div className="flex flex-col items-center gap-5 sm:flex-row">

          <div className="h-32 w-32 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">

            {

              photoPreview

                ?

                (

                  <img

                    src={photoPreview}

                    alt="Student"

                    className="h-full w-full object-cover"

                  />

                )

                :

                (

                  <div className="flex h-full items-center justify-center text-slate-300">

                    <User size={36} />

                  </div>

                )

            }

          </div>


          <div>

            <label

              htmlFor="photo-upload"

              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"

            >

              <Camera size={15} />

              {

                photoPreview

                  ?

                  "Change Photo"

                  :

                  "Upload Photo"

              }

            </label>


            <input

              id="photo-upload"

              type="file"

              accept="image/*"

              onChange={handlePhoto}

              className="hidden"

            />


            <p className="mt-2 text-xs text-slate-400">

              JPG, PNG or WEBP, maximum 2MB

            </p>

          </div>

        </div>

      </div>


      {/* Personal Details */}

      <SectionCard

        icon={User}

        title="Personal Details"

      >

        <div>

          <label className={labelClass}>

            Admission No

          </label>

          <input

            {...register(
              "admissionNo"
            )}

            className={inputClass}

          />

          <FieldError

            message={
              errors.admissionNo?.message
            }

          />

        </div>


        <div>

          <label className={labelClass}>

            PEN Number

          </label>

          <input

            {...register(
              "penNumber"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            GR No

          </label>

          <input

            {...register(
              "grNo"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            Roll No

          </label>

          <input

            {...register(
              "rollNo"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            First Name

          </label>

          <input

            {...register(
              "firstName"
            )}

            className={inputClass}

          />

          <FieldError

            message={
              errors.firstName?.message
            }

          />

        </div>


        <div>

          <label className={labelClass}>

            Middle Name

          </label>

          <input

            {...register(
              "middleName"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            Last Name

          </label>

          <input

            {...register(
              "lastName"
            )}

            className={inputClass}

          />

          <FieldError

            message={
              errors.lastName?.message
            }

          />

        </div>


        <div>

          <label className={labelClass}>

            Gender

          </label>

          <select

            {...register(
              "gender"
            )}

            className={inputClass}

          >

            <option value="">

              Select Gender

            </option>

            <option value="Male">

              Male

            </option>

            <option value="Female">

              Female

            </option>

            <option value="Other">

              Other

            </option>

          </select>

          <FieldError

            message={
              errors.gender?.message
            }

          />

        </div>


        <div>

          <label className={labelClass}>

            Date of Birth

          </label>

          <input

            type="date"

            {...register(
              "dob"
            )}

            className={inputClass}

          />

          <FieldError

            message={
              errors.dob?.message
            }

          />

        </div>


        <div>

          <label className={labelClass}>

            Place of Birth

          </label>

          <input

            {...register(
              "placeOfBirth"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            Blood Group

          </label>

          <select

            {...register(
              "bloodGroup"
            )}

            className={inputClass}

          >

            <option value="">

              Select

            </option>

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

          <label className={labelClass}>

            Religion

          </label>

          <input

            {...register(
              "religion"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            Category

          </label>

          <input

            {...register(
              "category"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            Sub Caste

          </label>

          <input

            {...register(
              "subCaste"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            Caste

          </label>

          <input

            {...register(
              "caste"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            Nationality

          </label>

          <input

            {...register(
              "nationality"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            Mother Tongue

          </label>

          <input

            {...register(
              "motherTongue"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            Aadhaar No

          </label>

          <input

            {...register(
              "aadhaarNo"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            Mobile

          </label>

          <input

            maxLength={10}

            {...register(
              "mobile"
            )}

            className={inputClass}

          />

          <FieldError

            message={
              errors.mobile?.message
            }

          />

        </div>


        <div>

          <label className={labelClass}>

            Email

          </label>

          <input

            type="email"

            {...register(
              "email"
            )}

            className={inputClass}

          />

          <FieldError

            message={
              errors.email?.message
            }

          />

        </div>


        <div>

          <label className={labelClass}>

            Parent Mobile

          </label>

          <input

            {...register(
              "parentMobile"
            )}

            className={inputClass}

          />

          <FieldError

            message={
              errors.parentMobile?.message
            }

          />

        </div>

      </SectionCard>


      {/* Parent Details */}

      <SectionCard

        icon={Users}

        title="Parent / Guardian Details"

      >

        <div>

          <label className={labelClass}>

            Father's Name

          </label>

          <input

            {...register(
              "fatherName"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            Father's Mobile

          </label>

          <input

            {...register(
              "fatherMobile"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            Father's Occupation

          </label>

          <input

            {...register(
              "fatherOccupation"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            Mother's Name

          </label>

          <input

            {...register(
              "motherName"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            Mother's Mobile

          </label>

          <input

            {...register(
              "motherMobile"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            Mother's Occupation

          </label>

          <input

            {...register(
              "motherOccupation"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            Guardian's Name

          </label>

          <input

            {...register(
              "guardianName"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            Guardian's Mobile

          </label>

          <input

            {...register(
              "guardianMobile"
            )}

            className={inputClass}

          />

        </div>

      </SectionCard>


      {/* Academic Details */}

      <SectionCard

        icon={GraduationCap}

        title="Academic Details"

      >


        {/* Academic Year */}

        <div>

          <label className={labelClass}>

            Academic Year

          </label>

          <select

            {...register(
              "academicYearId"
            )}

            className={inputClass}

          >

            <option value="">

              Select Academic Year

            </option>


            {

              academicYears.map(
                (year) => {

                  const yearId =

                    year.academic_year_id

                    ??

                    year.academicYearId

                    ??

                    year.id;


                  const yearName =
                    getAcademicYearLabel(
                      year,
                      yearId
                    );


                  return (

                    <option

                      key={yearId}

                      value={yearId}

                    >

                      {yearName}

                    </option>

                  );

                }
              )

            }

          </select>

          <FieldError

            message={
              errors.academicYearId?.message
            }

          />

        </div>


        {/* Class */}

        <div>

          <label className={labelClass}>

            Class

          </label>

          <select

            value={
              watchedClassId
              ??
              selectedClassId
            }

            onChange={
              handleClassChange
            }

            className={
              inputClass
            }

          >

            <option value="">

              Select Class

            </option>


            {

              classes.map(
                (classItem) => {

                  const classId =

                    classItem.class_id

                    ??

                    classItem.classId

                    ??

                    classItem.id;


                  const className =
                    getClassLabel(
                      classItem,
                      classId
                    );


                  return (

                    <option

                      key={classId}

                      value={classId}

                    >

                      {className}

                    </option>

                  );

                }
              )

            }

          </select>

          <FieldError

            message={
              errors.classId?.message
            }

          />

        </div>


        {/* Section */}

        <div>

          <label className={labelClass}>

            Section

          </label>

          <select

            disabled={
              !watchedClassId
            }

            {...register(
              "sectionId"
            )}

            className={
              inputClass
            }

          >

            <option value="">

              {

                watchedClassId

                  ?

                  "Select Section"

                  :

                  "Select Class First"

              }

            </option>


            {

              filteredSections.map(
                (section) => {

                  const sectionId =

                    section.section_id

                    ??

                    section.sectionId

                    ??

                    section.id;


                  const sectionName =
                    getSectionLabel(
                      section,
                      sectionId
                    );


                  return (

                    <option

                      key={sectionId}

                      value={sectionId}

                    >

                      {sectionName}

                    </option>

                  );

                }
              )

            }

          </select>

          <FieldError

            message={
              errors.sectionId?.message
            }

          />

        </div>


        <div>

          <label className={labelClass}>

            Admission Date

          </label>

          <input

            type="date"

            {...register(
              "admissionDate"
            )}

            className={inputClass}

          />

          <FieldError

            message={
              errors.admissionDate?.message
            }

          />

        </div>


        <div>

          <label className={labelClass}>

            Previous School

          </label>

          <input

            {...register(
              "previousSchool"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            Admission Std

          </label>

          <input

            {...register(
              "admissionStd"
            )}

            className={inputClass}

          />

        </div>

      </SectionCard>


      {/* Address Details */}

      <SectionCard

        icon={MapPin}

        title="Address Details"

      >

        <div>

          <label className={labelClass}>

            House / Flat No

          </label>

          <input

            {...register(
              "house"
            )}

            className={inputClass}

          />

        </div>


        <div className="md:col-span-2 lg:col-span-2">

          <label className={labelClass}>

            Street / Address

          </label>

          <input

            {...register(
              "address"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            Village

          </label>

          <input

            {...register(
              "village"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            City

          </label>

          <input

            {...register(
              "city"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            Taluka

          </label>

          <input

            {...register(
              "taluka"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            District

          </label>

          <input

            {...register(
              "district"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            State

          </label>

          <input

            {...register(
              "state"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            Country

          </label>

          <input

            {...register(
              "country"
            )}

            className={inputClass}

          />

        </div>


        <div>

          <label className={labelClass}>

            Pin Code

          </label>

          <input

            {...register(
              "pinCode"
            )}

            className={inputClass}

          />

        </div>


        <div className="flex items-center gap-2.5">

          <input

            type="checkbox"

            {...register(
              "isActive"
            )}

            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-200"

          />

          <span className="text-sm font-medium text-slate-700">

            Active Student

          </span>

        </div>

      </SectionCard>


      {/* Footer */}

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

        <button

          type="button"

          onClick={
            onClose
          }

          disabled={
            submitting
          }

          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"

        >

          Cancel

        </button>


        <button

          type="submit"

          disabled={
            submitting
          }

          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"

        >

          {

            submitting

              ?

              "Saving..."

              :

              student

                ?

                "Update Student"

                :

                "Create Student"

          }

        </button>

      </div>

    </form>

  );

};


export default StudentForm;