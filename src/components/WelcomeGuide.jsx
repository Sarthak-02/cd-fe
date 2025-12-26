import { X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth.store";
// import { useSchoolStore } from "../store/school.store";

const checklist = [
  {
    id: "create_users",
    label: "Create System Users",
    description: "Create admin, coordinators, and operators",
    route: "/users",
    allowed: ["admin"],
  },
  {
    id: "create_school",
    label: "Review School Details",
    description: "Verify school name, board, and basic information",
    route: "/school",
  },
  {
    id: "create_campus",
    label: "Review Campus",
    description: "Create or review campuses for your school",
    route: "/campus",
  },
  {
    id: "create_class",
    label: "Create Classes",
    description: "Add or review classes and sections",
    route: "/class",
  },
  {
    id: "add_teachers",
    label: "Add Teachers",
    description: "Add or review teaching staff",
    route: "/teacher",
  },
  {
    id: "add_students",
    label: "Add Students",
    description: "Enroll or review students",
    route: "/student",
  },
];

export default function WelcomeGuide() {
  const navigate = useNavigate();

  const {auth} = useAuth()
  // Example placeholders (replace with real store)
  const activeSchool =  auth.active_school;
  const isAdmin = auth.isadmin; // auth?.isadmin

  const visibleSteps = checklist.filter(
    (step) =>
      !step.allowed || step.allowed.includes(isAdmin ? "admin" : "non-admin")
  );

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 relative max-h-[80vh] flex flex-col">
      {/* <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        <X size={18} />
      </button> */}

      <h3 className="text-lg font-semibold text-blue-900">
        Welcome to {activeSchool?.label ?? "your School"} 🎉
      </h3>

      <p className="text-sm text-blue-800 mt-1">
        You are now managing data for this school. Use the steps below to get
        started.
      </p>

      {/* SCROLLABLE AREA */}
      <ul className="mt-4 space-y-3 overflow-y-auto pr-2">
        {visibleSteps.map((step) => (
          <li
            key={step.id}
            onClick={() => navigate(step.route)}
            className="group cursor-pointer rounded-lg p-3 
                   bg-white border border-blue-100
                   hover:bg-blue-100 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-900">{step.label}</p>
                <p className="text-sm text-blue-700">{step.description}</p>
              </div>

              <ArrowRight
                size={18}
                className="text-blue-400 group-hover:translate-x-1 transition"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
