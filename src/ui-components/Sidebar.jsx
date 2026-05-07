import React from "react";
import { useTranslation } from "react-i18next";

function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function BrandIcon() {
  return (
    <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    </div>
  );
}

export default function Sidebar({
  collapsed,
  toggleCollapse,
  currentPageKey,
  onSelect,
  paths,
  handleLogout,
  user,
  isMobile,
}) {
  const { t } = useTranslation();
  const username = user?.username || "User";
  const isAdmin = user?.isadmin;

  return (
    <div
      className={`
        h-full bg-slate-900 text-white flex flex-col transition-all duration-300 ease-in-out
        ${collapsed ? "w-[72px]" : "w-60"}
      `}
    >
      {/* Brand header */}
      <div
        className={`flex items-center h-14 border-b border-slate-800 px-4 shrink-0 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {collapsed ? (
          <button onClick={toggleCollapse} title={t("common.expandSidebar")} className="focus:outline-none">
            <BrandIcon />
          </button>
        ) : (
          <>
            <button
              onClick={() => onSelect("", "/")}
              className="flex items-center gap-2.5 min-w-0"
            >
              <BrandIcon />
              <span className="font-bold text-sm text-white tracking-wide truncate">
                {t("common.controlDesk")}
              </span>
            </button>
            {!isMobile && (
              <button
                onClick={toggleCollapse}
                title={t("common.collapseSidebar")}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
        {paths.map((item) => {
          const isActive = currentPageKey === item.labelKey;
          const itemLabel = item.labelKey ? t(item.labelKey) : item.label;
          return (
            <button
              key={item.path}
              onClick={() => onSelect(item.label, item.path)}
              title={collapsed ? itemLabel : undefined}
              className={`
                group flex items-center w-full rounded-lg transition-all duration-150
                ${collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5"}
                ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }
              `}
            >
              <span
                className={`shrink-0 ${
                  isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                }`}
              >
                {item.icon}
              </span>
              {!collapsed && (
                <span className="ml-3 text-sm font-medium truncate">{itemLabel}</span>
              )}
              {/* Active indicator bar */}
              {isActive && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom: user info + logout */}
      <div className="border-t border-slate-800 p-2 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-3 py-2 mb-1 min-w-0">
            <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {initials(username)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{username}</p>
              {isAdmin && (
                <p className="text-xs text-blue-400 font-medium">{t("common.admin")}</p>
              )}
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          title={collapsed ? t("common.logout") : undefined}
          className={`
            group flex items-center w-full rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition text-sm
            ${collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5"}
          `}
        >
          <svg
            className="w-5 h-5 shrink-0 group-hover:text-red-400 transition-colors"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
            />
          </svg>
          {!collapsed && (
            <span className="ml-3 font-medium group-hover:text-red-400 transition-colors">
              {t("common.logout")}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
