import {
  LayoutDashboard,

  // Setup
  Database,
  School,
  CalendarRange,
  Layers,
  Rows3,
  BookOpen,
  Tags,
  FileSpreadsheet,

  // Students
  Users,
  UserPlus,
  IdCard,
  Notebook,
  ClipboardCheck,
  FileText,

  // Academic
  CalendarDays,
  CalendarClock,
  CalendarCheck2,

  // Fees
  Receipt,
  CreditCard,
  Wallet,

  // Exams
  GraduationCap,
  PenSquare,
  BookOpenCheck,
  PenLine,
  Award,

  // Promotion
  ClipboardList,

  // Reports
  FileBarChart,
  FileBarChart2,
  BarChart3,
  FileCheck2,
  Calendar,
  ScrollText,

  // Communication
  MessageCircle,
  MessageSquare,
  Megaphone,

  // Users
  ShieldCheck,
  UserCog,

  // Settings
  Settings,
} from "lucide-react";


export const sidebarMenu = [

  /*
  |--------------------------------------------------------------------------
  | 1. Dashboard
  |--------------------------------------------------------------------------
  */

  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },


  /*
  |--------------------------------------------------------------------------
  | 2. Initial Setup
  |
  | First-time client setup order:
  |
  | School Profile
  | → Academic Year
  | → Classes
  | → Sections
  | → Subjects
  | → Fee Heads
  | → Fee Structure
  |--------------------------------------------------------------------------
  */

  {
    title: "Initial Setup",
    icon: Database,

    children: [

      {
        title: "School Profile",
        icon: School,
        path: "/school-profile",
        permission: "schoolProfile.view",
      },

      {
        title: "Academic Year",
        icon: CalendarRange,
        path: "/master/academic-years",
        permission: "academicYear.view",
      },

      {
        title: "Class Master",
        icon: Layers,
        path: "/master/classes",
        permission: "class.view",
      },

      {
        title: "Section Master",
        icon: Rows3,
        path: "/master/sections",
        permission: "section.view",
      },

      {
        title: "Subjects",
        icon: BookOpen,
        path: "/subjects",
        permission: "subject.view",
      },

      {
        title: "Fee Heads",
        icon: Tags,
        path: "/fee-heads",
        permission: "feeHead.view",
      },

      {
        title: "Fee Structure",
        icon: FileSpreadsheet,
        path: "/fee-structure",
        permission: "feeStructure.view",
      },

    ],
  },


  /*
  |--------------------------------------------------------------------------
  | 3. Student Management
  |--------------------------------------------------------------------------
  */

  {
    title: "Student Management",
    icon: Users,

    children: [

      {
        title: "Admission",
        icon: UserPlus,
        path: "/students/admission",
        permission: "student.create",
      },

      {
        title: "Student List",
        icon: IdCard,
        path: "/students",
        permission: "student.view",
      },

      {
        title: "Attendance",
        icon: Notebook,
        path: "/attendance",
        permission: "attendance.view",
      },

      {
        title: "Mark Attendance",
        icon: ClipboardCheck,
        path: "/attendance/register",
        permission: "attendance.mark",
      },

      {
        title: "Certificates",
        icon: FileText,
        path: "/certificates",
        permission: "certificate.view",
      },

    ],
  },


  /*
  |--------------------------------------------------------------------------
  | 4. Academic Management
  |--------------------------------------------------------------------------
  */

  {
    title: "Academic Management",
    icon: School,

    children: [

      {
        title: "Manage Timetable",
        icon: CalendarDays,
        path: "/timetable",
        permission: "timetable.view",
      },

      {
        title: "Class Timetable",
        icon: CalendarClock,
        path: "/timetable/class-view",
        permission: "timetable.view",
      },

      {
        title: "Teacher Timetable",
        icon: CalendarCheck2,
        path: "/timetable/teacher-view",
        permission: "timetable.view",
      },

    ],
  },


  /*
  |--------------------------------------------------------------------------
  | 5. Fee Management
  |--------------------------------------------------------------------------
  */

  {
    title: "Fee Management",
    icon: Receipt,

    children: [

      {
        title: "Student Fee",
        icon: CreditCard,
        path: "/fees/fee-student",
        permission: "studentFee.view",
      },

      {
        title: "Fee Collection",
        icon: Wallet,
        path: "/fees/fee-collection",
        permission: "feeCollection.view",
      },

    ],
  },


  /*
  |--------------------------------------------------------------------------
  | 6. Examination
  |--------------------------------------------------------------------------
  */

  {
    title: "Examination",
    icon: GraduationCap,

    children: [

      {
        title: "Exam Management",
        icon: PenSquare,
        path: "/exam-management",
        permission: "exam.view",
      },

      {
        title: "Exam Subjects",
        icon: BookOpenCheck,
        path: "/exam-subjects",
        permission: "examSubject.view",
      },

      {
        title: "Marks Entry",
        icon: PenLine,
        path: "/marks-entry",
        permission: "marks.update",
      },

      {
        title: "Results",
        icon: Award,
        path: "/exam/result",
        permission: "result.view",
      },

    ],
  },


  /*
  |--------------------------------------------------------------------------
  | 7. Promotion Management
  |--------------------------------------------------------------------------
  */

  {
    title: "Promotion Management",
    icon: GraduationCap,

    children: [

      {
        title: "Promote Students",
        icon: Users,
        path: "/promotion",
        permission: "promotion.view",
      },

      {
        title: "Promotion History",
        icon: ClipboardList,
        path: "/promotion/history",
        permission: "promotion.view",
      },

    ],
  },


  /*
  |--------------------------------------------------------------------------
  | 8. Communication
  |--------------------------------------------------------------------------
  */

  {
    title: "Communication",
    icon: MessageCircle,

    children: [

      {
        title: "WhatsApp",
        icon: MessageSquare,
        path: "/whatsapp",
        permission: "whatsapp.view",
      },

      {
        title: "Notice",
        icon: Megaphone,
        path: "/notice",
        permission: "notice.view",
      },

    ],
  },


  /*
  |--------------------------------------------------------------------------
  | 9. Reports
  |--------------------------------------------------------------------------
  */

  {
    title: "Reports",
    icon: ClipboardList,

    children: [

      {
        title: "Student Report",
        icon: FileBarChart,
        path: "/reports/students",
        permission: "report.view",
      },

      {
        title: "Attendance Report",
        icon: FileBarChart2,
        path: "/reports/attendance",
        permission: "report.view",
      },

      {
        title: "Fee Report",
        icon: BarChart3,
        path: "/reports/fees",
        permission: "report.view",
      },

      {
        title: "Exam Report",
        icon: FileCheck2,
        path: "/reports/exams",
        permission: "report.view",
      },

      {
        title: "Timetable Report",
        icon: Calendar,
        path: "/reports/timetable",
        permission: "report.view",
      },

      {
        title: "Certificate Report",
        icon: ScrollText,
        path: "/reports/certificate",
        permission: "report.view",
      },

    ],
  },


  /*
  |--------------------------------------------------------------------------
  | 10. User Management
  |--------------------------------------------------------------------------
  */

  {
    title: "User Management",
    icon: ShieldCheck,

    children: [

      {
        title: "Users",
        icon: Users,
        path: "/users",
        permission: "user.view",
      },

      {
        title: "Create User",
        icon: UserPlus,
        path: "/users/create",
        permission: "user.create",
      },

      {
        title: "Roles & Permissions",
        icon: UserCog,
        path: "/roles",
        permission: "role.manage",
      },

    ],
  },


  /*
  |--------------------------------------------------------------------------
  | 11. Settings
  |--------------------------------------------------------------------------
  */

  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
    permission: "settings.view",
  },

];