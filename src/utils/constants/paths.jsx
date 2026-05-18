import { School, Building2, Users, BookOpen, LayoutDashboard, ShieldCheck, ClipboardList, FileText } from "lucide-react";

export const paths = [
  { labelKey: "nav.userManagement", label: "User Management", path: "/users", permission:"user_management", icon: <Users size={20} /> },
  { labelKey: "nav.school", label: "School", path: "/school", permission:"school", icon: <School size={20} /> },
  { labelKey: "nav.campus", label: "Campus", path: "/campus", permission:"campus" ,icon: <Building2 size={20} /> },
  { labelKey: "nav.class", label: "Class", path: "/class", permission:"class" ,icon: <BookOpen size={20} /> },
  { labelKey: "nav.section", label: "Section", path: "/section",permission:"section" ,icon: <BookOpen size={20} /> },
  { labelKey: "nav.teacher", label: "Teacher", path: "/teacher",permission:"teacher", icon: <Users size={20} /> },
  { labelKey: "nav.student", label: "Student", path: "/student",permission:"student", icon: <Users size={20} /> },
  { labelKey: "nav.admission", label: "Admission", path: "/admission", permission:"admission", icon: <ClipboardList size={20} /> },
  { labelKey: "nav.reportCard", label: "Report Card", path: "/report-card", permission:"student", icon: <FileText size={20} /> },
  { labelKey: "nav.reportDashboard", label: "Report Dashboard", path: "/report-dashboard", permission:"campus", icon: <LayoutDashboard size={20} /> },
  { labelKey: "nav.priceTierPermissions", label: "Price Tier Permissions", path: "/price-tier-permissions", permission:"price_tier_permissions", icon: <ShieldCheck size={20} /> },
];




