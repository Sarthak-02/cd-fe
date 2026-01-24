import React, { useState } from "react";
import Sidebar from "./Sidebar";
import MobileNavbar from "./MobileNavbar";
import Header from "./Header";
import { useNavigate ,useLocation , Outlet } from "react-router-dom";
import { paths } from "../utils/constants/paths";
import { useAuth } from "../store/auth.store";


function getPermittedPaths(user){
  let page_permissions = user?.page_permissions || [];

  const isAdmin = user?.isadmin ?? false;

  if (isAdmin) {
    page_permissions.push("user_management");
  }

  const permittedPaths = paths?.filter(({ permission }) =>
    page_permissions?.includes(permission)
  );

  return permittedPaths
}
export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // desktop sidebar collapse
  const [collapsed, setCollapsed] = useState(true);

  

  function handleSelectPage(label, path) {
    // setCurrentPage(label);
    navigate(path);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }

  const { auth ,logout } = useAuth()

  const permittedPaths = getPermittedPaths(auth)
  const currentPage =
    permittedPaths.find((p) => location.pathname.startsWith(p.path))?.label ||
    "";
  
    const handleLogout = async () => {
      await logout();
      navigate("/login");
    };

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
          handleLogout={handleLogout}
        />
      </div>

      {/* Mobile Slide Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex w-full" onClick={(e) => {
          console.log("triggered",e.target.id)
          if (e.target === e.currentTarget) {
            setIsMobileMenuOpen(false);
          }

          }}>
          

          {/* Drawer */}
          <div className="w-60 bg-gray-800" id="sidebar-container">
            <Sidebar
              collapsed={false} // mobile always expanded
              toggleCollapse={() => {}}
              currentPage={currentPage}
              onSelect={handleSelectPage}
              paths={permittedPaths}
              handleLogout={handleLogout}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative" >
        {/* Desktop header */}
        <Header />

        {/* Mobile header */}
        <MobileNavbar onOpenMenu={() => setIsMobileMenuOpen(true)} />

        {/* PAGE CONTENT */}
        <div className="p-6 mt-14 ">
          <div className="text-gray-600">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
