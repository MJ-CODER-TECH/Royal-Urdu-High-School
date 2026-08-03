import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import * as z from "zod";

import {
  Loader2,
} from "lucide-react";

import {
  generateBonafide,
  generateTC,
  generateLC,
  generateCharacter,
} from "../../redux/certificate/certificateThunk";

import {
  getStudentsApi,
} from "../../api/student.api";

import {
  getClassesApi,
  getSectionsApi,
} from "../../api/master.api";


const schema = z.object({
  studentId: z
    .string()
    .min(
      1,
      "Student selection is required"
    ),

  certificateType: z
    .string()
    .min(
      1,
      "Certificate Type is required"
    ),

  issueDate: z
    .string()
    .min(
      1,
      "Issue Date is required"
    ),

  reason: z
    .string()
    .min(
      1,
      "Reason is required"
    ),

  remarks: z
    .string()
    .optional(),

  indexNumber: z
    .string()
    .optional(),

  status: z
    .string()
    .min(
      1,
      "Status is required"
    ),
});


const TYPE_ACTION_MAP = {
  Bonafide: (
    studentId,
    payload
  ) =>
    generateBonafide(
      studentId,
      payload
    ),

  "Transfer Certificate": (
    studentId,
    payload
  ) =>
    generateTC(
      studentId,
      payload
    ),

  "Leaving Certificate": (
    studentId,
    payload
  ) =>
    generateLC(
      studentId,
      payload
    ),

  "Character Certificate": (
    studentId,
    payload
  ) =>
    generateCharacter(
      studentId,
      payload
    ),
};


const CertificateForm = ({
  certificate,
  onClose,
}) => {
  const dispatch = useDispatch();

  const {
    submitting = false,
  } = useSelector(
    (state) =>
      state.certificate || {}
  );


  const [
    students,
    setStudents,
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
    classId,
    setClassId,
  ] = useState("");

  const [
    sectionId,
    setSectionId,
  ] = useState("");

  const [
    loadingStudents,
    setLoadingStudents,
  ] = useState(false);


  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: {
      errors,
    },
  } = useForm({
    resolver: zodResolver(
      schema
    ),

    defaultValues: {
      studentId: "",

      certificateType:
        "Bonafide",

      issueDate:
        new Date()
          .toISOString()
          .slice(0, 10),

      reason: "",

      remarks: "",

      indexNumber: "",

      status:
        "Generated",
    },
  });


  /* Load Classes and Sections */

  useEffect(() => {
    const loadMasters =
      async () => {
        try {
          const [
            classList,
            sectionList,
          ] =
            await Promise.all([
              getClassesApi(),
              getSectionsApi(),
            ]);

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

        } catch (error) {
          console.error(
            "Failed to load masters:",
            error
          );

          setClasses([]);
          setSections([]);
        }
      };

    loadMasters();
  }, []);


  /* Only selected class sections */

  const filteredSections =
    useMemo(() => {

      if (!classId) {
        return [];
      }

      return sections.filter(
        (section) =>
          String(
            section.class_id
          ) ===
          String(
            classId
          )
      );

    }, [
      sections,
      classId,
    ]);


  /* Load Students */

  useEffect(() => {

    const loadStudents =
      async () => {

        if (
          !classId ||
          !sectionId
        ) {
          setStudents([]);

          setValue(
            "studentId",
            ""
          );

          return;
        }

        setLoadingStudents(
          true
        );

        try {

          const response =
            await getStudentsApi({
              classId,
              sectionId,

              status:
                "Active",

              page: 1,

              limit: 500,
            });


          const studentList =
            response?.students ||
            response?.data ||
            [];


          setStudents(
            Array.isArray(
              studentList
            )
              ? studentList
              : []
          );

        } catch (error) {

          console.error(
            "Failed to load students:",
            error
          );

          setStudents([]);

        } finally {

          setLoadingStudents(
            false
          );

        }
      };


    loadStudents();

  }, [
    classId,
    sectionId,
    setValue,
  ]);


  /* Edit certificate */

  useEffect(() => {

    if (!certificate) {
      return;
    }


    const selectedClass =
      certificate.class_id
        ? String(
            certificate.class_id
          )
        : "";


    const selectedSection =
      certificate.section_id
        ? String(
            certificate.section_id
          )
        : "";


    setClassId(
      selectedClass
    );


    setSectionId(
      selectedSection
    );


    reset({

      studentId:
        String(
          certificate.student_id ||
          ""
        ),

      certificateType:
        certificate.certificate_type ||
        "Bonafide",

      issueDate:
        certificate.issue_date
          ? String(
              certificate.issue_date
            ).slice(
              0,
              10
            )
          : "",

      reason:
        certificate.reason ||
        "",

      remarks:
        certificate.remarks ||
        "",

      indexNumber:
        certificate.index_no ||
        "",

      status:
        certificate.status ||
        "Generated",

    });

  }, [
    certificate,
    reset,
  ]);


 const onSubmit =
  async (data) => {

    const actionCreator =
      TYPE_ACTION_MAP[
        data.certificateType
      ];


    if (!actionCreator) {

      alert(
        "Invalid certificate type."
      );

      return;

    }


    const payload = {

      issue_date:
        data.issueDate,

      reason:
        data.reason,

      remarks:
        data.remarks,

      index_no:
        data.indexNumber,

      status:
        data.status,

    };


    const success =
      await dispatch(

        actionCreator(
          data.studentId,
          payload
        )

      );


    if (success) {

      onClose?.();

    }

  };


  return (

    <form
      onSubmit={
        handleSubmit(
          onSubmit
        )
      }
      className="space-y-6"
    >


      {/* Student Selection */}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <h2 className="mb-4 text-base font-semibold text-slate-800">

          Student Filter & Selection

        </h2>


        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">


          {/* Class */}

          <div>

            <label className="mb-1 block text-xs font-medium text-slate-700">

              Class

            </label>


            <select

              value={classId}

              onChange={(
                event
              ) => {

                setClassId(
                  event.target.value
                );

                setSectionId(
                  ""
                );

                setStudents(
                  []
                );

                setValue(
                  "studentId",
                  ""
                );

              }}

              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"

            >

              <option value="">

                Select Class

              </option>


              {classes.map(
                (item) => (

                  <option

                    key={
                      item.class_id
                    }

                    value={
                      item.class_id
                    }

                  >

                    {
                      item.class_name
                    }

                  </option>

                )
              )}

            </select>

          </div>


          {/* Section */}

          <div>

            <label className="mb-1 block text-xs font-medium text-slate-700">

              Section

            </label>


            <select

              value={sectionId}

              onChange={(
                event
              ) => {

                setSectionId(
                  event.target.value
                );

                setValue(
                  "studentId",
                  ""
                );

              }}

              disabled={
                !classId
              }

              className="
                w-full
                rounded-lg
                border
                border-slate-300
                bg-white
                px-3
                py-2
                text-sm
                focus:border-indigo-500
                focus:outline-none
                disabled:cursor-not-allowed
                disabled:bg-slate-100
                disabled:text-slate-400
              "

            >

              <option value="">

                {
                  classId

                    ? "Select Section"

                    : "Select Class First"
                }

              </option>


              {
                filteredSections.map(
                  (section) => (

                    <option

                      key={
                        section.section_id
                      }

                      value={
                        section.section_id
                      }

                    >

                      {
                        section.section_name
                      }

                    </option>

                  )
                )
              }

            </select>

          </div>


          {/* Student */}

          <div className="md:col-span-2">

            <label className="mb-1 block text-xs font-medium text-slate-700">

              Select Student *

            </label>


            <select

              {...register(
                "studentId"
              )}

              disabled={
                !classId ||
                !sectionId ||
                loadingStudents
              }

              className="
                w-full
                rounded-lg
                border
                border-slate-300
                bg-white
                px-3
                py-2
                text-sm
                focus:border-indigo-500
                focus:outline-none
                disabled:cursor-not-allowed
                disabled:bg-slate-100
              "

            >

              <option value="">

                {
                  loadingStudents

                    ? "Loading students..."

                    : !classId

                    ? "Select Class First"

                    : !sectionId

                    ? "Select Section First"

                    : "Select Student"
                }

              </option>


              {
                students.map(
                  (student) => {

                    const name = [

                      student.first_name,

                      student.middle_name,

                      student.last_name,

                    ]
                      .filter(
                        Boolean
                      )
                      .join(
                        " "
                      );


                    return (

                      <option

                        key={
                          student.student_id
                        }

                        value={
                          student.student_id
                        }

                      >

                        {
                          student.admission_no
                        }

                        {" - "}

                        {
                          name
                        }

                      </option>

                    );

                  }
                )
              }

            </select>


            {
              errors.studentId && (

                <p className="mt-1 text-xs text-rose-500">

                  {
                    errors
                      .studentId
                      .message
                  }

                </p>

              )
            }

          </div>

        </div>

      </div>


      {/* Certificate Information */}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <h2 className="mb-4 text-base font-semibold text-slate-800">

          Certificate Information

        </h2>


        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">


          <div>

            <label className="mb-1 block text-xs font-medium text-slate-700">

              Certificate Type *

            </label>


            <select

              {...register(
                "certificateType"
              )}

              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"

            >

              <option value="Bonafide">

                Bonafide

              </option>

              <option value="Transfer Certificate">

                Transfer Certificate

              </option>

              <option value="Leaving Certificate">

                Leaving Certificate

              </option>

              <option value="Character Certificate">

                Character Certificate

              </option>

            </select>

          </div>


          <div>

            <label className="mb-1 block text-xs font-medium text-slate-700">

              Issue Date *

            </label>


            <input

              type="date"

              {...register(
                "issueDate"
              )}

              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"

            />

          </div>


          <div>

            <label className="mb-1 block text-xs font-medium text-slate-700">

              Status *

            </label>


            <select

              {...register(
                "status"
              )}

              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"

            >

              <option value="Generated">

                Generated

              </option>

              <option value="Pending">

                Pending

              </option>

              <option value="Draft">

                Draft

              </option>

            </select>

          </div>


          <div>

            <label className="mb-1 block text-xs font-medium text-slate-700">

              Index Number

            </label>


            <input

              type="text"

              placeholder="e.g. IND-1029"

              {...register(
                "indexNumber"
              )}

              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"

            />

          </div>


          <div className="md:col-span-2">

            <label className="mb-1 block text-xs font-medium text-slate-700">

              Reason *

            </label>


            <textarea

              rows={2}

              placeholder="Specify the reason..."

              {...register(
                "reason"
              )}

              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"

            />


            {
              errors.reason && (

                <p className="mt-1 text-xs text-rose-500">

                  {
                    errors
                      .reason
                      .message
                  }

                </p>

              )
            }

          </div>


          <div className="md:col-span-2">

            <label className="mb-1 block text-xs font-medium text-slate-700">

              Remarks

            </label>


            <textarea

              rows={2}

              placeholder="Additional remarks..."

              {...register(
                "remarks"
              )}

              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"

            />

          </div>

        </div>

      </div>


      {/* Buttons */}

      <div className="flex items-center justify-end gap-3">

        <button

          type="button"

          onClick={
            onClose
          }

          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"

        >

          Cancel

        </button>


        <button

          type="submit"

          disabled={
            submitting
          }

          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"

        >

          {
            submitting && (

              <Loader2
                size={16}
                className="animate-spin"
              />

            )
          }


          Generate Certificate

        </button>

      </div>

    </form>

  );
};


export default CertificateForm;