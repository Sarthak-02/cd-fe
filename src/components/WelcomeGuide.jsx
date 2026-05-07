import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, School, Building2, BookOpen, GraduationCap,
  LayoutDashboard, ChevronRight, ShieldCheck, Layers,
} from "lucide-react";
import { useAuth } from "../store/auth.store";
import { useCampusStore } from "../store/campus.store";
import { useUsersStore } from "../store/user.store";

// Greeting based on hour
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// Formatted date string
function getDate() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Map each route to richer metadata for the quick-access cards
const QUICK_LINKS = [
  {
    permission: "school",
    path: "/school",
    label: "School",
    description: "Review school details and board info",
    icon: School,
    color: "bg-blue-50 text-blue-600",
    ring: "ring-blue-100",
  },
  {
    permission: "campus",
    path: "/campus",
    label: "Campus",
    description: "Manage campuses and locations",
    icon: Building2,
    color: "bg-cyan-50 text-cyan-600",
    ring: "ring-cyan-100",
  },
  {
    permission: "class",
    path: "/class",
    label: "Classes",
    description: "Configure classes and grading",
    icon: BookOpen,
    color: "bg-emerald-50 text-emerald-600",
    ring: "ring-emerald-100",
  },
  {
    permission: "section",
    path: "/section",
    label: "Sections",
    description: "Organise sections within classes",
    icon: Layers,
    color: "bg-teal-50 text-teal-600",
    ring: "ring-teal-100",
  },
  {
    permission: "teacher",
    path: "/teacher",
    label: "Teachers",
    description: "Add and manage teaching staff",
    icon: GraduationCap,
    color: "bg-orange-50 text-orange-600",
    ring: "ring-orange-100",
  },
  {
    permission: "student",
    path: "/student",
    label: "Students",
    description: "Enrol and manage students",
    icon: Users,
    color: "bg-pink-50 text-pink-600",
    ring: "ring-pink-100",
  },
  {
    permission: "campus",          // re-uses campus permission
    path: "/report-dashboard",
    label: "Report Dashboard",
    description: "View and configure reports",
    icon: LayoutDashboard,
    color: "bg-violet-50 text-violet-600",
    ring: "ring-violet-100",
  },
  {
    permission: "user_management",
    path: "/users",
    label: "User Management",
    description: "Create users and manage permissions",
    icon: ShieldCheck,
    color: "bg-indigo-50 text-indigo-600",
    ring: "ring-indigo-100",
  },
];

function StatPill({ label, count, loading }) {
  return (
    <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm">
      <span className="text-xl font-bold text-gray-800">
        {loading ? (
          <span className="inline-block w-6 h-5 bg-gray-100 animate-pulse rounded" />
        ) : (
          count ?? "—"
        )}
      </span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}

function QuickCard({ link, onClick }) {
  const Icon = link.icon;
  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md hover:border-gray-200 transition-all duration-150 flex items-start gap-3"
    >
      <div className={`w-10 h-10 rounded-xl ${link.color} ring-1 ${link.ring} flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
          {link.label}
        </p>
        <p className="text-xs text-gray-400 mt-0.5 leading-snug">{link.description}</p>
      </div>
      <ChevronRight
        size={16}
        className="text-gray-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1"
      />
    </button>
  );
}

export default function WelcomeGuide() {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const activeSchool = auth.active_school;
  const username = auth.username || "User";
  const isAdmin = auth.isadmin;
  const pagePermissions = [
    ...(auth.page_permissions || []),
    ...(isAdmin ? ["user_management", "price_tier_permissions"] : []),
  ];

  const { campuses, loading: loadingCampuses, fetchCampuses } = useCampusStore();
  const { users, loading: loadingUsers, fetchUsers } = useUsersStore();

  useEffect(() => {
    fetchCampuses();
    if (isAdmin) fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleLinks = QUICK_LINKS.filter((l) =>
    pagePermissions.includes(l.permission)
  );

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Welcome banner */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl px-6 py-6 text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-blue-500/10 pointer-events-none" />
        <div className="absolute -bottom-8 -right-2 w-48 h-48 rounded-full bg-blue-500/5 pointer-events-none" />

        <div className="relative">
          <p className="text-slate-400 text-sm font-medium">{getDate()}</p>
          <h2 className="mt-1 text-xl font-bold text-white">
            {getGreeting()}, {username}!
          </h2>
          <p className="mt-1 text-slate-300 text-sm">
            Managing{" "}
            <span className="font-semibold text-white">
              {activeSchool?.label ?? "your school"}
            </span>
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-3 mt-5">
            <StatPill
              label={campuses.length === 1 ? "Campus" : "Campuses"}
              count={campuses.length}
              loading={loadingCampuses}
            />
            {isAdmin && (
              <StatPill
                label={users.length === 1 ? "User" : "Users"}
                count={users.length}
                loading={loadingUsers}
              />
            )}
          </div>
        </div>
      </div>

      {/* Quick access */}
      {visibleLinks.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-0.5">
            Quick Access
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {visibleLinks.map((link) => (
              <QuickCard
                key={link.path}
                link={link}
                onClick={() => navigate(link.path)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
