import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Save,
  Plus,
  Trash2,
  LoaderCircle,
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  UserRound,
  Hash,
  AlertCircle,
  CheckCircle2,
  FileSignature,
  Stamp,
  ImageOff,
  X,
} from "lucide-react";

import {
  getSchoolProfile,
  createSchoolProfile,
  updateSchoolProfile,
  addSchoolUnit,
  deleteSchoolUnit,
} from "../../redux/schoolProfile/schoolProfileThunk";


/* -------------------------------------------------------------------------- */
/* API CONFIG                                                                 */
/* -------------------------------------------------------------------------- */

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"
).replace(/\/+$/, "");


const MAX_FILE_SIZE_MB = 2;

const MAX_FILE_SIZE_BYTES =
  MAX_FILE_SIZE_MB *
  1024 *
  1024;


const ACCEPTED_MIME_TYPES = [

  "image/jpeg",

  "image/jpg",

  "image/png",

  "image/webp",

];


const ACCEPTED_FILE_EXTENSIONS =

  ".jpg,.jpeg,.png,.webp";


/* -------------------------------------------------------------------------- */
/* INITIAL FORM                                                               */
/* -------------------------------------------------------------------------- */

const INITIAL_FORM_STATE = {

  school_name: "",

  address: "",

  phone: "",

  email: "",

  website: "",

  principle_name: "",

  affiliation_no: "",

  udise_no: "",

  principal_signature: null,

  school_stamp: null,

};


/* -------------------------------------------------------------------------- */
/* FILE URL                                                                   */
/* -------------------------------------------------------------------------- */

const getFileUrl = (filePath) => {

  if (!filePath) {

    return null;

  }


  if (
    /^https?:\/\//i.test(
      filePath
    )
  ) {

    return filePath;

  }


  return (

    `${API_BASE_URL}/` +

    filePath.replace(
      /^\/+/,
      ""
    )

  );

};


/* -------------------------------------------------------------------------- */
/* FILE VALIDATION                                                            */
/* -------------------------------------------------------------------------- */

const validateImageFile = (
  file
) => {

  if (!file) {

    return null;

  }


  if (

    !ACCEPTED_MIME_TYPES.includes(

      file.type

    )

  ) {

    return (

      "Only JPG, JPEG, PNG and WEBP images are allowed."

    );

  }


  if (

    file.size >

    MAX_FILE_SIZE_BYTES

  ) {

    return (

      `Maximum file size is ${MAX_FILE_SIZE_MB} MB.`

    );

  }


  return null;

};


/* -------------------------------------------------------------------------- */
/* IMAGE UPLOAD COMPONENT                                                     */
/* -------------------------------------------------------------------------- */

const ImageUploadField = ({

  id,

  label,

  icon: Icon,

  file,

  previewUrl,

  existingUrl,

  onSelect,

  onClear,

  error,

  minPreviewHeight = 130,

}) => {


  const displayUrl =

    previewUrl ||

    existingUrl;


  return (

    <div>

      <label

        htmlFor={id}

        className="
          mb-2
          flex
          items-center
          gap-2
          text-sm
          font-semibold
          text-slate-700
        "

      >

        <Icon

          size={17}

          className="
            text-blue-600
          "

        />

        {label}

      </label>


      <input

        id={id}

        type="file"

        accept={
          ACCEPTED_FILE_EXTENSIONS
        }

        onChange={

          (event) => {

            onSelect(

              event.target.files?.[0] ||

              null

            );

          }

        }

        className="
          block
          w-full
          rounded-xl
          border
          border-slate-200
          bg-white
          px-3
          py-2
          text-sm
          text-slate-600

          file:mr-4
          file:rounded-lg
          file:border-0
          file:bg-blue-50
          file:px-3
          file:py-2
          file:text-sm
          file:font-semibold
          file:text-blue-700

          hover:file:bg-blue-100
        "

      />


      {file && (

        <button

          type="button"

          onClick={

            onClear

          }

          className="
            mt-2
            inline-flex
            items-center
            gap-2
            rounded-lg
            border
            border-red-200
            bg-red-50
            px-3
            py-1.5
            text-xs
            font-semibold
            text-red-600
          "

        >

          <X size={14} />

          Remove selected file

        </button>

      )}


      {error && (

        <p

          className="
            mt-2
            flex
            items-center
            gap-1
            text-xs
            font-medium
            text-red-600
          "

        >

          <AlertCircle size={14} />

          {error}

        </p>

      )}


      <div

        className="
          mt-4
          overflow-hidden
          rounded-xl
          border
          border-slate-200
          bg-white
          p-3
        "

      >

        {

          displayUrl

            ? (

              <>

                <div

                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                  "

                >

                  <span

                    className="
                      text-xs
                      font-semibold
                      text-slate-500
                    "

                  >

                    {

                      previewUrl

                        ? "Selected image"

                        : "Current image"

                    }

                  </span>


                  {

                    previewUrl && (

                      <span

                        className="
                          rounded-full
                          bg-amber-100
                          px-2
                          py-1
                          text-[10px]
                          font-semibold
                          text-amber-700
                        "

                      >

                        Pending Save

                      </span>

                    )

                  }

                </div>


                <div

                  style={{

                    minHeight:

                      minPreviewHeight,

                  }}

                  className="
                    flex
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-lg
                    bg-slate-50
                  "

                >

                  <img

                    src={
                      displayUrl
                    }

                    alt={
                      label
                    }

                    className="
                      max-h-40
                      max-w-full
                      object-contain
                    "

                    onError={

                      (
                        event
                      ) => {

                        event
                          .currentTarget
                          .style
                          .display =

                          "none";

                      }

                    }

                  />

                </div>

              </>

            )

            : (

              <div

                style={{

                  minHeight:

                    minPreviewHeight,

                }}

                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  border-dashed
                  border-slate-300
                  text-slate-400
                "

              >

                <ImageOff
                  size={24}
                />

                <span

                  className="
                    text-xs
                  "

                >

                  No image uploaded

                </span>

              </div>

            )

        }

      </div>


      <p

        className="
          mt-2
          text-xs
          text-slate-400
        "

      >

        JPG, PNG or WEBP · Maximum 2 MB

      </p>

    </div>

  );

};


/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                                                             */
/* -------------------------------------------------------------------------- */

const SchoolProfileForm = ({

  schoolProfile,

}) => {


  const dispatch =

    useDispatch();


  const {

    submitting,

    unitSubmitting,

    deletingUnitId,

  } = useSelector(

    (state) =>

      state.schoolProfile

  );


  const isEditMode =

    Boolean(

      schoolProfile?.school_id

    );


  const [

    formData,

    setFormData,

  ] = useState(

    INITIAL_FORM_STATE

  );


  const [

    unitData,

    setUnitData,

  ] = useState({

    school_name: "",

    udise_no: "",

  });


  const [

    signaturePreviewUrl,

    setSignaturePreviewUrl,

  ] = useState(

    null

  );


  const [

    stampPreviewUrl,

    setStampPreviewUrl,

  ] = useState(

    null

  );


  const [

    fileErrors,

    setFileErrors,

  ] = useState({

    signature: "",

    stamp: "",

  });


  const [

    message,

    setMessage,

  ] = useState(

    ""

  );


  const [

    formError,

    setFormError,

  ] = useState(

    ""

  );


  /* ---------------------------------------------------------------------- */
  /* LOAD PROFILE                                                           */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {

    if (!schoolProfile) {

      setFormData(

        INITIAL_FORM_STATE

      );

      return;

    }


    setFormData({

      school_name:

        schoolProfile.school_name ||

        "",


      address:

        schoolProfile.address ||

        "",


      phone:

        schoolProfile.phone ||

        "",


      email:

        schoolProfile.email ||

        "",


      website:

        schoolProfile.website ||

        "",


      principle_name:

        schoolProfile.principle_name ||

        "",


      affiliation_no:

        schoolProfile.affiliation_no ||

        "",


      udise_no:

        schoolProfile.udise_no ||

        "",


      principal_signature:

        null,


      school_stamp:

        null,

    });


    setSignaturePreviewUrl(

      null

    );


    setStampPreviewUrl(

      null

    );


    setFileErrors({

      signature: "",

      stamp: "",

    });


  }, [

    schoolProfile

  ]);


  /* ---------------------------------------------------------------------- */
  /* AUTO HIDE MESSAGE                                                      */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {

    if (!message) {

      return;

    }


    const timer =

      setTimeout(

        () => {

          setMessage("");

        },

        4000

      );


    return () => {

      clearTimeout(

        timer

      );

    };


  }, [

    message

  ]);


  /* ---------------------------------------------------------------------- */
  /* INPUT CHANGE                                                           */
  /* ---------------------------------------------------------------------- */

  const handleChange = (

    event

  ) => {

    const {

      name,

      value,

    } = event.target;


    setFormData(

      (previous) => ({

        ...previous,

        [name]:

          value,

      })

    );

  };


  /* ---------------------------------------------------------------------- */
  /* SIGNATURE                                                              */
  /* ---------------------------------------------------------------------- */

  const handleSignatureSelect =

    useCallback(

      (file) => {


        const validationError =

          validateImageFile(

            file

          );


        setFileErrors(

          (previous) => ({

            ...previous,

            signature:

              validationError ||

              "",

          })

        );


        setSignaturePreviewUrl(

          (previous) => {


            if (

              previous

            ) {

              URL.revokeObjectURL(

                previous

              );

            }


            if (

              file &&

              !validationError

            ) {

              return URL.createObjectURL(

                file

              );

            }


            return null;

          }

        );


        setFormData(

          (previous) => ({

            ...previous,

            principal_signature:

              validationError

                ? null

                : file,

          })

        );


      },

      []

    );


  /* ---------------------------------------------------------------------- */
  /* STAMP                                                                  */
  /* ---------------------------------------------------------------------- */

  const handleStampSelect =

    useCallback(

      (file) => {


        const validationError =

          validateImageFile(

            file

          );


        setFileErrors(

          (previous) => ({

            ...previous,

            stamp:

              validationError ||

              "",

          })

        );


        setStampPreviewUrl(

          (previous) => {


            if (

              previous

            ) {

              URL.revokeObjectURL(

                previous

              );

            }


            if (

              file &&

              !validationError

            ) {

              return URL.createObjectURL(

                file

              );

            }


            return null;

          }

        );


        setFormData(

          (previous) => ({

            ...previous,

            school_stamp:

              validationError

                ? null

                : file,

          })

        );


      },

      []

    );


  /* ---------------------------------------------------------------------- */
  /* SUBMIT                                                                 */
  /* ---------------------------------------------------------------------- */

  const handleSubmit = async (

    event

  ) => {


    event.preventDefault();


    setMessage("");


    setFormError("");


    if (

      fileErrors.signature ||

      fileErrors.stamp

    ) {

      setFormError(

        "Please fix image errors before saving."

      );

      return;

    }


    const submitData =

      new FormData();


    submitData.append(

      "school_name",

      formData.school_name.trim()

    );


    submitData.append(

      "address",

      formData.address.trim()

    );


    submitData.append(

      "phone",

      formData.phone.trim()

    );


    submitData.append(

      "email",

      formData.email.trim()

    );


    submitData.append(

      "website",

      formData.website.trim()

    );


    submitData.append(

      "principle_name",

      formData.principle_name.trim()

    );


    submitData.append(

      "affiliation_no",

      formData.affiliation_no.trim()

    );


    submitData.append(

      "udise_no",

      formData.udise_no.trim()

    );


    if (

      formData.principal_signature

    ) {

      submitData.append(

        "principal_signature",

        formData.principal_signature

      );

    }


    if (

      formData.school_stamp

    ) {

      submitData.append(

        "school_stamp",

        formData.school_stamp

      );

    }


    const result =

      isEditMode

        ? await dispatch(

            updateSchoolProfile({

              id:

                schoolProfile.school_id,

              data:

                submitData,

            })

          )

        : await dispatch(

            createSchoolProfile(

              submitData

            )

          );


    const isSuccess =

      isEditMode

        ? updateSchoolProfile
            .fulfilled
            .match(
              result
            )

        : createSchoolProfile
            .fulfilled
            .match(
              result
            );


    if (

      isSuccess

    ) {

      setMessage(

        isEditMode

          ? "School profile updated successfully."

          : "School profile created successfully."

      );


      await dispatch(

        getSchoolProfile()

      );


    } else {

      setFormError(

        result.payload ||

        "Failed to save school profile."

      );

    }

  };


  /* ---------------------------------------------------------------------- */
  /* SCHOOL UNIT                                                            */
  /* ---------------------------------------------------------------------- */

  const handleUnitChange = (

    event

  ) => {

    const {

      name,

      value,

    } = event.target;


    setUnitData(

      (previous) => ({

        ...previous,

        [name]:

          value,

      })

    );

  };


  const handleAddUnit = async (

    event

  ) => {


    event.preventDefault();


    const result =

      await dispatch(

        addSchoolUnit({

          schoolId:

            schoolProfile.school_id,

          data: {

            school_name:

              unitData.school_name.trim(),

            udise_no:

              unitData.udise_no.trim(),

          },

        })

      );


    if (

      addSchoolUnit
        .fulfilled
        .match(
          result
        )

    ) {

      setUnitData({

        school_name: "",

        udise_no: "",

      });


      setMessage(

        "School unit added successfully."

      );


      dispatch(

        getSchoolProfile()

      );

    }

  };


  const handleDeleteUnit = async (

    unitId

  ) => {


    const confirmed =

      window.confirm(

        "Delete this school unit?"

      );


    if (

      !confirmed

    ) {

      return;

    }


    await dispatch(

      deleteSchoolUnit(

        unitId

      )

    );


    dispatch(

      getSchoolProfile()

    );

  };


  /* ---------------------------------------------------------------------- */
  /* EXISTING FILES                                                         */
  /* ---------------------------------------------------------------------- */

  const existingSignatureUrl =

    useMemo(

      () =>

        getFileUrl(

          schoolProfile
            ?.principle_signature_path

        ),

      [

        schoolProfile
          ?.principle_signature_path

      ]

    );


  const existingStampUrl =

    useMemo(

      () =>

        getFileUrl(

          schoolProfile
            ?.school_stamp_path

        ),

      [

        schoolProfile
          ?.school_stamp_path

      ]

    );


  const schoolUnits =

    schoolProfile
      ?.school_units ||

    [];


  /* ---------------------------------------------------------------------- */
  /* UI                                                                     */
  /* ---------------------------------------------------------------------- */

  return (

    <div

      className="
        space-y-6
      "

    >


      {

        (

          message ||

          formError

        ) && (

          <div

            className={`

              flex

              items-center

              gap-3

              rounded-xl

              border

              p-4

              ${
                formError

                  ? "border-red-200 bg-red-50 text-red-700"

                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }

            `}

          >

            {

              formError

                ? (

                  <AlertCircle

                    size={20}

                  />

                )

                : (

                  <CheckCircle2

                    size={20}

                  />

                )

            }


            <p

              className="
                text-sm
                font-semibold
              "

            >

              {

                formError ||

                message

              }

            </p>

          </div>

        )

      }


      <form

        onSubmit={

          handleSubmit

        }

        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "

      >


        <div

          className="
            border-b
            border-slate-200
            px-6
            py-5
          "

        >

          <div

            className="
              flex
              items-center
              gap-3
            "

          >

            <div

              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-blue-50
                text-blue-600
              "

            >

              <Building2

                size={21}

              />

            </div>


            <div>

              <h2

                className="
                  font-bold
                  text-slate-800
                "

              >

                {

                  isEditMode

                    ? "Main School Information"

                    : "Complete School Setup"

                }

              </h2>


              <p

                className="
                  mt-1
                  text-xs
                  text-slate-500
                "

              >

                {

                  isEditMode

                    ? "Update school details, signature and stamp."

                    : "Enter school information to complete the initial setup."

                }

              </p>

            </div>

          </div>

        </div>


        <div

          className="
            grid
            grid-cols-1
            gap-5
            p-6
            md:grid-cols-2
          "

        >


          {/* SCHOOL NAME */}

          <div>

            <label

              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "

            >

              School Name *

            </label>


            <input

              type="text"

              name="school_name"

              value={
                formData.school_name
              }

              onChange={
                handleChange
              }

              required

              className="
                w-full
                rounded-xl
                border
                border-slate-200
                px-4
                py-2.5
                text-sm
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/20
              "

            />

          </div>


          {/* UDISE */}

          <div>

            <label

              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "

            >

              UDISE Number

            </label>


            <input

              type="text"

              name="udise_no"

              value={
                formData.udise_no
              }

              onChange={
                handleChange
              }

              className="
                w-full
                rounded-xl
                border
                border-slate-200
                px-4
                py-2.5
                text-sm
                outline-none
                focus:border-blue-500
              "

            />

          </div>


          {/* PHONE */}

          <div>

            <label

              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "

            >

              Phone

            </label>


            <input

              type="tel"

              name="phone"

              value={
                formData.phone
              }

              onChange={
                handleChange
              }

              className="
                w-full
                rounded-xl
                border
                border-slate-200
                px-4
                py-2.5
                text-sm
              "

            />

          </div>


          {/* EMAIL */}

          <div>

            <label

              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "

            >

              Email

            </label>


            <input

              type="email"

              name="email"

              value={
                formData.email
              }

              onChange={
                handleChange
              }

              className="
                w-full
                rounded-xl
                border
                border-slate-200
                px-4
                py-2.5
                text-sm
              "

            />

          </div>


          {/* WEBSITE */}

          <div>

            <label

              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "

            >

              Website

            </label>


            <input

              type="text"

              name="website"

              value={
                formData.website
              }

              onChange={
                handleChange
              }

              className="
                w-full
                rounded-xl
                border
                border-slate-200
                px-4
                py-2.5
                text-sm
              "

            />

          </div>


          {/* PRINCIPAL */}

          <div>

            <label

              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "

            >

              Principal Name

            </label>


            <input

              type="text"

              name="principle_name"

              value={
                formData.principle_name
              }

              onChange={
                handleChange
              }

              className="
                w-full
                rounded-xl
                border
                border-slate-200
                px-4
                py-2.5
                text-sm
              "

            />

          </div>


          {/* AFFILIATION */}

          <div>

            <label

              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "

            >

              Affiliation Number

            </label>


            <input

              type="text"

              name="affiliation_no"

              value={
                formData.affiliation_no
              }

              onChange={
                handleChange
              }

              className="
                w-full
                rounded-xl
                border
                border-slate-200
                px-4
                py-2.5
                text-sm
              "

            />

          </div>


          {/* IMAGES */}

          <div

            className="
              md:col-span-2
              grid
              grid-cols-1
              gap-6
              lg:grid-cols-2
            "

          >

            <div

              className="
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                p-5
              "

            >

              <ImageUploadField

                id="principal_signature"

                label="Principal Signature"

                icon={
                  FileSignature
                }

                file={
                  formData
                    .principal_signature
                }

                previewUrl={
                  signaturePreviewUrl
                }

                existingUrl={
                  existingSignatureUrl
                }

                onSelect={
                  handleSignatureSelect
                }

                onClear={

                  () =>

                    handleSignatureSelect(

                      null

                    )

                }

                error={
                  fileErrors.signature
                }

              />

            </div>


            <div

              className="
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                p-5
              "

            >

              <ImageUploadField

                id="school_stamp"

                label="School Stamp"

                icon={
                  Stamp
                }

                file={
                  formData
                    .school_stamp
                }

                previewUrl={
                  stampPreviewUrl
                }

                existingUrl={
                  existingStampUrl
                }

                onSelect={
                  handleStampSelect
                }

                onClear={

                  () =>

                    handleStampSelect(

                      null

                    )

                }

                error={
                  fileErrors.stamp
                }

              />

            </div>

          </div>


          {/* ADDRESS */}

          <div

            className="
              md:col-span-2
            "

          >

            <label

              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
              "

            >

              Address

            </label>


            <textarea

              rows="3"

              name="address"

              value={
                formData.address
              }

              onChange={
                handleChange
              }

              className="
                w-full
                resize-none
                rounded-xl
                border
                border-slate-200
                px-4
                py-3
                text-sm
              "

            />

          </div>

        </div>


        <div

          className="
            flex
            justify-end
            border-t
            border-slate-200
            bg-slate-50
            px-6
            py-4
          "

        >

          <button

            type="submit"

            disabled={

              submitting ||

              Boolean(

                fileErrors.signature ||

                fileErrors.stamp

              )

            }

            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-blue-600
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              hover:bg-blue-700
              disabled:opacity-60
            "

          >

            {

              submitting

                ? (

                  <LoaderCircle

                    size={17}

                    className="
                      animate-spin
                    "

                  />

                )

                : (

                  <Save

                    size={17}

                  />

                )

            }


            {

              submitting

                ? "Saving..."

                : isEditMode

                  ? "Save School Profile"

                  : "Complete School Setup"

            }

          </button>

        </div>

      </form>


      {/* SCHOOL UNITS */}

      {

        isEditMode

          ? (

            <div

              className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
              "

            >

              <div

                className="
                  border-b
                  border-slate-200
                  px-6
                  py-5
                "

              >

                <h2

                  className="
                    font-bold
                    text-slate-800
                  "

                >

                  School Units

                </h2>


                <p

                  className="
                    mt-1
                    text-xs
                    text-slate-500
                  "

                >

                  Add additional school names and UDISE numbers.

                </p>

              </div>


              <form

                onSubmit={
                  handleAddUnit
                }

                className="
                  grid
                  grid-cols-1
                  gap-4
                  border-b
                  border-slate-200
                  bg-slate-50
                  p-5
                  md:grid-cols-[1fr_1fr_auto]
                "

              >

                <input

                  type="text"

                  name="school_name"

                  value={
                    unitData.school_name
                  }

                  onChange={
                    handleUnitChange
                  }

                  placeholder="
                    School unit name
                  "

                  required

                  className="
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-2.5
                    text-sm
                  "

                />


                <input

                  type="text"

                  name="udise_no"

                  value={
                    unitData.udise_no
                  }

                  onChange={
                    handleUnitChange
                  }

                  placeholder="
                    UDISE number
                  "

                  required

                  className="
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-2.5
                    text-sm
                  "

                />


                <button

                  type="submit"

                  disabled={
                    unitSubmitting
                  }

                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-emerald-600
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                  "

                >

                  <Plus
                    size={17}
                  />

                  Add Unit

                </button>

              </form>


              <table

                className="
                  w-full
                "

              >

                <thead

                  className="
                    bg-slate-50
                  "

                >

                  <tr>

                    <th

                      className="
                        p-4
                        text-left
                      "

                    >

                      #

                    </th>


                    <th

                      className="
                        p-4
                        text-left
                      "

                    >

                      School Name

                    </th>


                    <th

                      className="
                        p-4
                        text-left
                      "

                    >

                      UDISE

                    </th>


                    <th

                      className="
                        p-4
                        text-right
                      "

                    >

                      Action

                    </th>

                  </tr>

                </thead>


                <tbody>

                  {

                    schoolUnits.map(

                      (

                        unit,

                        index

                      ) => (

                        <tr

                          key={

                            unit.school_unit_id

                          }

                          className="
                            border-t
                          "

                        >

                          <td

                            className="
                              p-4
                            "

                          >

                            {

                              index + 1

                            }

                          </td>


                          <td

                            className="
                              p-4
                              font-semibold
                            "

                          >

                            {

                              unit.school_name

                            }

                          </td>


                          <td

                            className="
                              p-4
                            "

                          >

                            {

                              unit.udise_no

                            }

                          </td>


                          <td

                            className="
                              p-4
                              text-right
                            "

                          >

                            <button

                              type="button"

                              onClick={

                                () =>

                                  handleDeleteUnit(

                                    unit.school_unit_id

                                  )

                              }

                              disabled={

                                deletingUnitId ===

                                unit.school_unit_id

                              }

                              className="
                                rounded-lg
                                p-2
                                text-red-600
                                hover:bg-red-50
                              "

                            >

                              <Trash2

                                size={18}

                              />

                            </button>

                          </td>

                        </tr>

                      )

                    )

                  }

                </tbody>

              </table>

            </div>

          )

          : (

            <div

              className="
                rounded-2xl
                border
                border-dashed
                border-slate-300
                bg-slate-50
                p-10
                text-center
              "

            >

              <Building2

                size={32}

                className="
                  mx-auto
                  text-slate-400
                "

              />


              <h3

                className="
                  mt-3
                  font-bold
                  text-slate-700
                "

              >

                School Units

              </h3>


              <p

                className="
                  mt-2
                  text-sm
                  text-slate-500
                "

              >

                Save the main school profile first.
                Then you can add additional school units.

              </p>

            </div>

          )

      }

    </div>

  );

};


export default
SchoolProfileForm;