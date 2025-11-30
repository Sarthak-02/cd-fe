import React, { useState } from "react";
import Sidebar from "./Sidebar";
import MobileNavbar from "./MobileNavbar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { paths } from "../utils/constants/paths";
import { useUser } from "../state";


function getPermittedPaths(user){
  let page_permissions = user?.page_permissions;

  const isAdmin = user?.isadmin ?? false;

  if (isAdmin) {
    page_permissions.push("user_management");
  }

  const permittedPaths = paths.filter(({ permission }) =>
    page_permissions.includes(permission)
  );

  return permittedPaths
}
export default function Layout() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("School");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // desktop sidebar collapse
  const [collapsed, setCollapsed] = useState(false);

  function handleSelectPage(label, path) {
    setCurrentPage(label);
    navigate(path);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }

  const { user } = useUser.getState();

  const permittedPaths = getPermittedPaths(user)

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block z-40 ">
        <Sidebar
          currentPage={currentPage}
          onSelect={handleSelectPage}
          collapsed={collapsed}
          toggleCollapse={() => setCollapsed(!collapsed)}
          paths = {permittedPaths}
        />
      </div>

      {/* Mobile Slide Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            // className="flex-1 bg-black bg-opacity-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="w-60 bg-gray-800">
            <Sidebar
              collapsed={false} // mobile always expanded
              toggleCollapse={() => {}}
              currentPage={currentPage}
              onSelect={handleSelectPage}
              paths={permittedPaths}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Desktop header */}
        <Header />

        {/* Mobile header */}
        <MobileNavbar onOpenMenu={() => setIsMobileMenuOpen(true)} />

        {/* PAGE CONTENT */}
        <div className="p-6 mt-14 overflow-y-auto">
          <p className="text-gray-600">
            <Outlet />
          </p>
        </div>
      </div>
    </div>
  );
}
