import React from "react";
import { School } from "lucide-react";
import Dropdown from "../ui-components/Dropdown";
import { useAuth } from "../store/auth.store";
import WelcomeGuide from "../components/WelcomeGuide";
import { useTranslation } from "react-i18next";

const CARD_COLORS = [
  "bg-blue-50 border-blue-100 hover:bg-blue-100 text-blue-900",
  "bg-violet-50 border-violet-100 hover:bg-violet-100 text-violet-900",
  "bg-emerald-50 border-emerald-100 hover:bg-emerald-100 text-emerald-900",
  "bg-orange-50 border-orange-100 hover:bg-orange-100 text-orange-900",
];

function SchoolCard({ school, onSelect, index }) {
  const colorClass = CARD_COLORS[index % CARD_COLORS.length];
  const initial = (school.label || "?")[0].toUpperCase();
  return (
    <button
      onClick={() => onSelect(school.value)}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${colorClass}`}
    >
      <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center text-base font-bold shrink-0">
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{school.label}</p>
        <p className="text-xs opacity-60 mt-0.5">{school.value}</p>
      </div>
      <School size={16} className="shrink-0 opacity-40" />
    </button>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const {
    auth: { site_permissions = [], active_school = {} },
    setActiveSchool,
  } = useAuth();

  const hasSchool = active_school && Object.keys(active_school).length > 0;

  if (hasSchool) {
    return <WelcomeGuide />;
  }

  const useCards = site_permissions.length <= 6;

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 mb-4">
            <School size={26} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{t("home.selectSchoolTitle")}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {t("home.selectSchoolSubtitle")}
          </p>
        </div>

        {/* School list or dropdown */}
        {useCards ? (
          <div className="space-y-2.5">
            {site_permissions.map((school, i) => (
              <SchoolCard
                key={school.value}
                school={school}
                index={i}
                onSelect={setActiveSchool}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <Dropdown
              label={t("home.schoolLabel")}
              options={site_permissions}
              selected={active_school?.value}
              onChange={setActiveSchool}
            />
          </div>
        )}
      </div>
    </div>
  );
}
