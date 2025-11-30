import { School, Building2, Users, BookOpen } from "lucide-react";

export const paths = [
  { label: "User Management", path: "/users", permission:"user_management", icon: <Users size={20} /> },
  { label: "School", path: "/school", permission:"school", icon: <School size={20} /> },
  { label: "Campus", path: "/campus", permission:"campus" ,icon: <Building2 size={20} /> },
  { label: "Class", path: "/class", permission:"class" ,icon: <BookOpen size={20} /> },
  { label: "Section", path: "/section",permission:"section" ,icon: <BookOpen size={20} /> },
  { label: "Teacher", path: "/teacher",permission:"teacher", icon: <Users size={20} /> },
  { label: "Student", path: "/student",permission:"student", icon: <Users size={20} /> },
];




