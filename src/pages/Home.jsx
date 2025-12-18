import React from "react";

import Dropdown from "../ui-components/Dropdown";
import { useAuth } from "../store/auth.store";
import WelcomeGuide from "../components/WelcomeGuide";

export default function Home() {
  const {
    auth: { site_permissions, active_school = {} },
    setActiveSchool,
  } = useAuth();


  return (
    <>
      {active_school && Object.keys(active_school)?.length > 0 ? (
        <div>
          <WelcomeGuide />
        </div>
      ) : (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-6 pb-10">
            <h2 className="text-xl font-semibold text-gray-800 text-center">
              Select a School
            </h2>

            <p className="text-sm text-gray-500 text-center mt-1 mb-6">
              Choose the school you want to manage
            </p>

            <Dropdown
              label="School"
              options={site_permissions}
              value={active_school?.value}
              onChange={(val) => setActiveSchool(val)}
            />
          </div>
        </div>
      )}
    </>
  );
}
