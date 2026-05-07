import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNavbar from "./MobileNavbar";
import Header from "./Header";
import { paths } from "../utils/constants/paths";
import { useAuth } from "../store/auth.store";

function getPermittedPaths(user) {
  let page_permissions = [...(user?.page_permissions || [])];
  const isAdmin = user?.isadmin ?? false;
  if (isAdmin) {
    page_permissions.push("user_management");
    page_permissions.push("price_tier_permissions");
  }
  return paths.filter(({ permission }) => page_permissions.includes(permission));
}

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const { auth, logout } = useAuth();
  const permittedPaths = getPermittedPaths(auth);
  const currentPage =
    permittedPaths.find((p) => location.pathname.startsWith(p.path))?.label || "";

  function handleSelectPage(label, path) {
    navigate(path);
    setIsMobileMenuOpen(false);
  }

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0 z-40 h-full">
        <Sidebar
          currentPage={currentPage}
          onSelect={handleSelectPage}
          collapsed={collapsed}
          toggleCollapse={() => setCollapsed((c) => !c)}
          paths={permittedPaths}
          handleLogout={handleLogout}
          user={auth}
        />
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-50 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              className="relative w-64 h-full z-10 flex-shrink-0"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: "tween", duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar
                collapsed={false}
                toggleCollapse={() => {}}
                currentPage={currentPage}
                onSelect={handleSelectPage}
                paths={permittedPaths}
                handleLogout={handleLogout}
                user={auth}
                isMobile
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Desktop header */}
        <Header
          currentPage={currentPage}
          user={auth}
          handleLogout={handleLogout}
        />

        {/* Mobile header */}
        <MobileNavbar
          onOpenMenu={() => setIsMobileMenuOpen(true)}
          currentPage={currentPage}
          user={auth}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
