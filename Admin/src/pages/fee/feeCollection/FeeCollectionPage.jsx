import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Search,
  Eye,
  Trash2,
  Plus,
  Loader2,
  Receipt,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

import {
  getFeeCollections,
  deleteFeeReceipt,
} from "../../../redux/fee/feeCollection/feeCollectionThunk";

import {
  fetchClasses,
} from "../../../redux/master/classMasterThunk";

import {
  fetchSections,
} from "../../../redux/section/sectionThunk";

import {
  fetchAcademicYears,
} from "../../../redux/master/academicYearThunk";

import usePermission from "../../../hooks/usePermission";

import CollectFeeModal from "./CollectFeeModal";
import FeeReceiptModal from "./FeeReceiptModal";


const FeeCollectionPage = () => {
  const dispatch = useDispatch();


  /*
  |--------------------------------------------------------------------------
  | REDUX STATE
  |--------------------------------------------------------------------------
  */

  const {
    collections,
    loading,
    pagination,
    error,
  } = useSelector(
    (state) => state.feeCollection
  );


  const {
    classes = [],
  } = useSelector(
    (state) => state.classMaster
  );


  const {
    sections = [],
  } = useSelector(
    (state) => state.section
  );


  const {
    academicYears = [],
  } = useSelector(
    (state) => state.academicYear
  );


  const {
    hasPermission,
  } = usePermission();


  /*
  |--------------------------------------------------------------------------
  | FILTER STATES
  |--------------------------------------------------------------------------
  */

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const [academicYearId, setAcademicYearId] =
    useState("");

  const [classId, setClassId] =
    useState("");

  const [sectionId, setSectionId] =
    useState("");

  const [paymentMode, setPaymentMode] =
    useState("");


  /*
  |--------------------------------------------------------------------------
  | MODAL STATES
  |--------------------------------------------------------------------------
  */

  const [openCollect, setOpenCollect] =
    useState(false);

  const [selectedFee, setSelectedFee] =
    useState(null);

  const [receiptId, setReceiptId] =
    useState(null);


  /*
  |--------------------------------------------------------------------------
  | LOAD MASTER DATA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    dispatch(fetchClasses());

    dispatch(fetchSections());

    dispatch(fetchAcademicYears());

  }, [dispatch]);


  /*
  |--------------------------------------------------------------------------
  | FILTER SECTIONS BY SELECTED CLASS
  |--------------------------------------------------------------------------
  */

  const filteredSections = useMemo(() => {

    /*
    |--------------------------------------------------------------
    | Class select nahi hai
    | Section dropdown disabled rahega
    | Isliye empty array return karenge
    |--------------------------------------------------------------
    */

    if (!classId) {
      return [];
    }


    /*
    |--------------------------------------------------------------
    | Selected class ke sections
    |--------------------------------------------------------------
    */

    return sections.filter(
      (section) =>
        String(section.class_id) ===
        String(classId)
    );

  }, [sections, classId]);


  /*
  |--------------------------------------------------------------------------
  | API QUERY
  |--------------------------------------------------------------------------
  */

  const query = useMemo(
    () => ({

      page,

      limit: 10,

      search,

      academic_year_id:
        academicYearId,

      class_id:
        classId,

      section_id:
        sectionId,

      payment_mode:
        paymentMode,

    }),

    [
      page,
      search,
      academicYearId,
      classId,
      sectionId,
      paymentMode,
    ]
  );


  /*
  |--------------------------------------------------------------------------
  | FETCH FEE COLLECTIONS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    dispatch(
      getFeeCollections(query)
    );

  }, [
    dispatch,
    query,
  ]);


  /*
  |--------------------------------------------------------------------------
  | DELETE RECEIPT
  |--------------------------------------------------------------------------
  */

  const handleDelete = (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this receipt?"
      );


    if (!confirmDelete) {
      return;
    }


    dispatch(
      deleteFeeReceipt(id)
    ).then(() => {

      dispatch(
        getFeeCollections(query)
      );

    });

  };


  /*
  |--------------------------------------------------------------------------
  | RESET FILTERS
  |--------------------------------------------------------------------------
  */

  const handleResetFilters = () => {

    setSearch("");

    setAcademicYearId("");

    setClassId("");

    setSectionId("");

    setPaymentMode("");

    setPage(1);

  };


  /*
  |--------------------------------------------------------------------------
  | FORMAT CURRENCY
  |--------------------------------------------------------------------------
  */

  const formatCurrency = (
    amount
  ) => {

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",

        currency: "INR",

        maximumFractionDigits: 0,
      }
    ).format(
      amount || 0
    );

  };


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (

    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">


      {/* =========================================================
          HEADER
      ========================================================= */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          justify-between
          gap-4
          bg-white
          p-5
          rounded-xl
          border
          border-gray-100
          shadow-sm
        "
      >

        <div>

          <h1
            className="
              text-2xl
              font-bold
              text-gray-900
              tracking-tight
            "
          >
            Fee Collection
          </h1>


          <p
            className="
              text-sm
              text-gray-500
              mt-0.5
            "
          >
            Collect, track, and manage
            student fee payment receipts.
          </p>

        </div>


        {/* COLLECT FEE BUTTON */}

        {hasPermission(
          "feeCollection.collect"
        ) && (

          <button
            type="button"

            onClick={() => {

              setSelectedFee(null);

              setOpenCollect(true);

            }}

            className="
              inline-flex
              items-center
              justify-center
              gap-2

              bg-emerald-600
              hover:bg-emerald-700

              text-white

              px-4
              py-2.5

              rounded-lg

              text-sm
              font-semibold

              transition-colors

              shadow-sm

              active:scale-[0.98]
            "
          >

            <Plus size={18} />

            Collect Fee

          </button>

        )}

      </div>


      {/* =========================================================
          FILTER BAR
      ========================================================= */}

      <div
        className="
          bg-white

          p-4

          rounded-xl

          border
          border-gray-100

          shadow-sm

          space-y-3
        "
      >


        <div
          className="
            flex
            flex-wrap
            gap-3
            items-center
          "
        >


          {/* =====================================================
              SEARCH
          ===================================================== */}

          <div
            className="
              relative
              flex-1
              min-w-[240px]
            "
          >

            <Search
              size={18}
              className="
                absolute
                left-3
                top-2.5
                text-gray-400
              "
            />


            <input

              type="text"

              value={search}

              onChange={(e) => {

                setSearch(
                  e.target.value
                );

                setPage(1);

              }}

              placeholder="
                Search by student name,
                receipt no...
              "

              className="
                w-full

                border
                border-gray-200

                rounded-lg

                pl-9
                pr-3
                py-2

                text-sm

                focus:outline-none

                focus:ring-2

                focus:ring-blue-500/20

                focus:border-blue-500

                transition-colors
              "

            />

          </div>


          {/* =====================================================
              ACADEMIC YEAR
          ===================================================== */}

          <select

            value={
              academicYearId
            }

            onChange={(e) => {

              setAcademicYearId(
                e.target.value
              );

              setPage(1);

            }}

            className="
              border
              border-gray-200

              rounded-lg

              px-3
              py-2

              text-sm

              bg-white

              text-gray-700

              focus:outline-none

              focus:border-blue-500
            "
          >

            <option value="">
              Academic Year
            </option>


            {academicYears.map(
              (year) => (

                <option
                  key={
                    year.academic_year_id
                  }

                  value={
                    year.academic_year_id
                  }
                >

                  {year.year_start}
                  -
                  {year.year_end}

                </option>

              )
            )}

          </select>


          {/* =====================================================
              CLASS
          ===================================================== */}

          <select

            value={
              classId
            }

            onChange={(e) => {

              /*
              |----------------------------------------------
              | New class select
              | Old section automatically remove
              |----------------------------------------------
              */

              setClassId(
                e.target.value
              );


              setSectionId(
                ""
              );


              setPage(1);

            }}

            className="
              border
              border-gray-200

              rounded-lg

              px-3
              py-2

              text-sm

              bg-white

              text-gray-700

              focus:outline-none

              focus:border-blue-500
            "
          >

            <option value="">
              All Classes
            </option>


            {classes.map(
              (cls) => (

                <option
                  key={
                    cls.class_id
                  }

                  value={
                    cls.class_id
                  }
                >

                  {cls.class_name}

                </option>

              )
            )}

          </select>


          {/* =====================================================
              SECTION
              ONLY SELECTED CLASS SECTIONS
          ===================================================== */}

          <select

            value={
              sectionId
            }


            /*
            |------------------------------------------------
            | Class select nahi:
            | Section dropdown disabled
            |------------------------------------------------
            */

            disabled={
              !classId
            }


            onChange={(e) => {

              setSectionId(
                e.target.value
              );

              setPage(1);

            }}


            className="
              border
              border-gray-200

              rounded-lg

              px-3
              py-2

              text-sm

              bg-white

              text-gray-700

              focus:outline-none

              focus:border-blue-500

              disabled:bg-gray-100

              disabled:text-gray-400

              disabled:cursor-not-allowed
            "
          >


            <option value="">

              {classId

                ? "All Sections"

                : "Select Class First"

              }

            </option>


            {filteredSections.map(
              (section) => (

                <option

                  key={
                    section.section_id
                  }

                  value={
                    section.section_id
                  }

                >

                  {section.section_name}

                </option>

              )
            )}


          </select>


          {/* =====================================================
              PAYMENT MODE
          ===================================================== */}

          <select

            value={
              paymentMode
            }

            onChange={(e) => {

              setPaymentMode(
                e.target.value
              );

              setPage(1);

            }}

            className="
              border
              border-gray-200

              rounded-lg

              px-3
              py-2

              text-sm

              bg-white

              text-gray-700

              focus:outline-none

              focus:border-blue-500
            "
          >

            <option value="">
              Payment Mode
            </option>

            <option value="cash">
              Cash
            </option>

            <option value="online">
              Online
            </option>

            <option value="upi">
              UPI
            </option>

            <option value="cheque">
              Cheque
            </option>

          </select>


          {/* =====================================================
              RESET FILTER
          ===================================================== */}

          {(
            search ||

            academicYearId ||

            classId ||

            sectionId ||

            paymentMode

          ) && (

            <button

              type="button"

              onClick={
                handleResetFilters
              }

              className="
                p-2

                text-gray-500

                hover:text-gray-700

                hover:bg-gray-100

                rounded-lg

                transition-colors
              "

              title="
                Reset Filters
              "
            >

              <RotateCcw
                size={16}
              />

            </button>

          )}


        </div>

      </div>


      {/* =========================================================
          ERROR
      ========================================================= */}

      {error && (

        <div
          className="
            p-4

            bg-rose-50

            border
            border-rose-100

            text-rose-700

            rounded-xl

            text-sm

            font-medium
          "
        >

          {error}

        </div>

      )}


      {/* =========================================================
          TABLE
      ========================================================= */}

      <div
        className="
          bg-white

          rounded-xl

          shadow-sm

          border
          border-gray-100

          overflow-hidden
        "
      >

        <div
          className="
            overflow-x-auto
          "
        >

          <table
            className="
              w-full

              text-left

              text-sm

              text-gray-600
            "
          >


            <thead
              className="
                bg-gray-50/80

                border-b

                border-gray-100

                text-xs

                font-semibold

                text-gray-500

                uppercase

                tracking-wider
              "
            >

              <tr>

                <th className="px-6 py-3.5">
                  Receipt No
                </th>

                <th className="px-6 py-3.5">
                  Student
                </th>

                <th className="px-6 py-3.5">
                  Class
                </th>

                <th className="px-6 py-3.5">
                  Academic Year
                </th>

                <th className="px-6 py-3.5">
                  Payment Date
                </th>

                <th
                  className="
                    px-6
                    py-3.5
                    text-right
                  "
                >
                  Amount
                </th>

                <th
                  className="
                    px-6
                    py-3.5
                    text-center
                  "
                >
                  Action
                </th>

              </tr>

            </thead>


            <tbody
              className="
                divide-y
                divide-gray-100
              "
            >


              {/* LOADING */}

              {loading ? (

                <tr>

                  <td
                    colSpan={7}

                    className="
                      text-center

                      py-12

                      text-gray-400
                    "
                  >

                    <div
                      className="
                        flex

                        flex-col

                        items-center

                        justify-center

                        gap-2
                      "
                    >

                      <Loader2
                        className="
                          animate-spin

                          text-blue-600
                        "

                        size={24}
                      />

                      <span
                        className="
                          text-sm

                          font-medium
                        "
                      >

                        Loading records...

                      </span>

                    </div>

                  </td>

                </tr>

              ) :


              /* EMPTY */

              collections.length === 0 ? (

                <tr>

                  <td
                    colSpan={7}

                    className="
                      text-center

                      py-12

                      text-gray-400
                    "
                  >

                    <div
                      className="
                        flex

                        flex-col

                        items-center

                        justify-center

                        gap-2
                      "
                    >

                      <Receipt
                        size={32}

                        className="
                          text-gray-300
                        "
                      />

                      <p
                        className="
                          font-semibold

                          text-gray-600
                        "
                      >

                        No Fee Collections Found

                      </p>

                      <p
                        className="
                          text-xs

                          text-gray-400
                        "
                      >

                        Try adjusting your filters
                        or search query.

                      </p>

                    </div>

                  </td>

                </tr>

              ) :


              /* DATA */

              (

                collections.map(
                  (item) => (

                    <tr

                      key={
                        item.collection_id
                      }

                      className="
                        hover:bg-gray-50/50

                        transition-colors
                      "
                    >


                      <td
                        className="
                          px-6

                          py-4

                          font-semibold

                          text-gray-900
                        "
                      >

                        {
                          item.receipt_no ||
                          "-"
                        }

                      </td>


                      <td
                        className="
                          px-6

                          py-4
                        "
                      >

                        <span
                          className="
                            font-medium

                            text-gray-800
                          "
                        >

                          {
                            item.student_name ||
                            "-"
                          }

                        </span>

                      </td>


                      <td
                        className="
                          px-6

                          py-4

                          text-gray-600
                        "
                      >

                        {
                          item.class_name ||
                          "-"
                        }

                      </td>


                      <td
                        className="
                          px-6

                          py-4

                          text-gray-600
                        "
                      >

                        {
                          item.academic_year ||
                          "-"
                        }

                      </td>


                      <td
                        className="
                          px-6

                          py-4

                          text-gray-600
                        "
                      >

                        {
                          item.payment_date ||
                          "-"
                        }

                      </td>


                      <td
                        className="
                          px-6

                          py-4

                          text-right

                          font-bold

                          text-emerald-600
                        "
                      >

                        {
                          formatCurrency(
                            item.total_amount
                          )
                        }

                      </td>


                      {/* ACTION */}

                      <td
                        className="
                          px-6

                          py-4
                        "
                      >

                        <div
                          className="
                            flex

                            items-center

                            justify-center

                            gap-2
                          "
                        >


                          <button

                            type="button"

                            onClick={() =>

                              setReceiptId(
                                item.collection_id
                              )

                            }

                            className="
                              p-1.5

                              bg-blue-50

                              text-blue-600

                              hover:bg-blue-100

                              rounded-lg

                              transition-colors
                            "

                            title="
                              View Receipt
                            "
                          >

                            <Eye
                              size={16}
                            />

                          </button>


                          {hasPermission(
                            "feeCollection.delete"
                          ) && (

                            <button

                              type="button"

                              onClick={() =>

                                handleDelete(
                                  item.collection_id
                                )

                              }

                              className="
                                p-1.5

                                bg-rose-50

                                text-rose-600

                                hover:bg-rose-100

                                rounded-lg

                                transition-colors
                              "

                              title="
                                Delete Receipt
                              "
                            >

                              <Trash2
                                size={16}
                              />

                            </button>

                          )}


                        </div>

                      </td>


                    </tr>

                  )
                )

              )}


            </tbody>

          </table>

        </div>


        {/* =====================================================
            PAGINATION
        ===================================================== */}

        {!loading &&

          collections.length > 0 && (

          <div
            className="
              flex

              flex-col

              sm:flex-row

              items-center

              justify-between

              gap-4

              px-6

              py-4

              border-t

              border-gray-100

              bg-gray-50/30
            "
          >


            <p
              className="
                text-xs

                text-gray-500

                font-medium
              "
            >

              Total Records:

              {" "}

              <span
                className="
                  text-gray-900

                  font-bold
                "
              >

                {
                  pagination?.total ||
                  0
                }

              </span>

            </p>


            <div
              className="
                flex

                items-center

                gap-2
              "
            >


              <button

                type="button"

                disabled={
                  page <= 1
                }

                onClick={() =>

                  setPage(
                    (currentPage) =>
                      currentPage - 1
                  )

                }

                className="
                  inline-flex

                  items-center

                  gap-1

                  border

                  border-gray-200

                  bg-white

                  text-gray-700

                  px-3

                  py-1.5

                  rounded-lg

                  text-xs

                  font-semibold

                  disabled:opacity-50

                  disabled:cursor-not-allowed

                  hover:bg-gray-50

                  transition-colors

                  shadow-sm
                "
              >

                <ChevronLeft
                  size={14}
                />

                Previous

              </button>


              <span
                className="
                  px-3

                  py-1.5

                  text-xs

                  font-medium

                  text-gray-600

                  bg-gray-100

                  rounded-lg
                "
              >

                Page

                {" "}

                {
                  pagination?.page ||
                  page
                }

                {" "}

                of

                {" "}

                {
                  pagination?.totalPages ||
                  1
                }

              </span>


              <button

                type="button"

                disabled={
                  page >=
                  (
                    pagination?.totalPages ||
                    1
                  )
                }

                onClick={() =>

                  setPage(
                    (currentPage) =>
                      currentPage + 1
                  )

                }

                className="
                  inline-flex

                  items-center

                  gap-1

                  border

                  border-gray-200

                  bg-white

                  text-gray-700

                  px-3

                  py-1.5

                  rounded-lg

                  text-xs

                  font-semibold

                  disabled:opacity-50

                  disabled:cursor-not-allowed

                  hover:bg-gray-50

                  transition-colors

                  shadow-sm
                "
              >

                Next

                <ChevronRight
                  size={14}
                />

              </button>


            </div>

          </div>

        )}

      </div>


      {/* =========================================================
          COLLECT FEE MODAL
      ========================================================= */}

      {openCollect && (

        <CollectFeeModal

          open={
            openCollect
          }

          studentFee={
            selectedFee
          }

          onClose={() => {

            setOpenCollect(
              false
            );

            setSelectedFee(
              null
            );

          }}

          onSuccess={() => {

            dispatch(
              getFeeCollections(
                query
              )
            );

          }}

        />

      )}


      {/* =========================================================
          RECEIPT MODAL
      ========================================================= */}

      {receiptId && (

        <FeeReceiptModal

          receiptId={
            receiptId
          }

          close={() =>

            setReceiptId(
              null
            )

          }

        />

      )}


    </div>

  );

};


export default FeeCollectionPage;