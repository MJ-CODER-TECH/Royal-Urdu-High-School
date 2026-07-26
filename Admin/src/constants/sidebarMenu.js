import {
  LayoutDashboard,
  Users,
  Receipt,
  CalendarDays,
  GraduationCap,
  ClipboardList,
  Settings,
  MessageCircle,
  ShieldCheck,
  UserPlus,
  UserCog,
  School,
  FileText,
  Notebook,
  CreditCard,
  Database,
  BookOpenCheck,

  // Newly added — icons for items that were missing one
  IdCard,
  ClipboardCheck,
  BookOpen,
  CalendarClock,
  CalendarCheck2,
  CalendarRange,
  Calendar,
  Layers,
  Rows3,
  Tags,
  FileSpreadsheet,
  Wallet,
  PenSquare,
  PenLine,
  Award,
  FileBarChart,
  FileBarChart2,
  BarChart3,
  FileCheck2,
  ScrollText,
  MessageSquare,
  Megaphone,
} from "lucide-react";


export const sidebarMenu = [

  // Dashboard

  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },


  // Students

  {
    title: "Students Management",
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


      // Attendance

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


      // Certificate

      {
        title: "Certificates",
        icon: FileText,
        path: "/certificates",
        permission: "certificate.view",
      },

    ],
  },



  // Academic

  {
    title: "Academic Management",
    icon: School,

    children: [

      {
        title: "Subjects",
        icon: BookOpen,
        path: "/subjects",
        permission: "subject.view",
      },


      {
        title: "Manage Timetable",
        icon: CalendarDays,
        path: "/timetable",
        permission: "timetable.view",
      },

      {
        title: "Class Timetable View",
        icon: CalendarClock,
        path: "/timetable/class-view",
        permission: "timetable.view",
      },

      {
        title: "Teacher Timetable View",
        icon: CalendarCheck2,
        path: "/timetable/teacher-view",
        permission: "timetable.view",
      },

    ],
  },



  // Master

  {
    title: "Master Management",
    icon: Database,

    children: [

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
        title: "Academic Year",
        icon: CalendarRange,
        path: "/master/academic-years",
        permission: "academicYear.view",
      },

    ],
  },



  // Fees

  {
    title: "Fees Management",
    icon: Receipt,

    children: [

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



  // Exams

  {
    title: "Exams Management",
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
        title: "Result",
        icon: Award,
        path: "/exam/result",
        permission: "result.view",
      },

    ],
  },



  // Reports

  {
    title: "Reports Management",
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



  // Communication

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



  // Users

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



  // Settings

  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
    permission: "settings.view",
  },


];