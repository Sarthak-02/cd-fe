import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Listing from "../../ui-components/Listing";
import CardSkeleton from "../../ui-components/skeletons/CardSkeleton";
import SearchBar from "../../ui-components/SearchBar";
import Button from "../../ui-components/Button";

const AVATAR_COLORS = [
  "bg-slate-100 text-slate-700",
  "bg-gray-100 text-gray-700",
  "bg-zinc-100 text-zinc-700",
  "bg-neutral-100 text-neutral-700",
  "bg-stone-100 text-stone-700",
  "bg-blue-100 text-blue-700",
  "bg-indigo-100 text-indigo-700",
  "bg-violet-100 text-violet-700",
];

function avatarColor(name) {
  return AVATAR_COLORS[(name || "").charCodeAt(0) % AVATAR_COLORS.length];
}

function UserCard({ user, onClick }) {
  const initial = (user.username || "?")[0].toUpperCase();
  const siteCount = Array.isArray(user.site_permissions) ? user.site_permissions.length : null;
  const pageCount = Array.isArray(user.page_permissions) ? user.page_permissions.length : null;

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(user.username)}`}>
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors text-sm">
            {user.username}
          </p>
          {user.isadmin && (
            <span className="text-xs font-medium bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full shrink-0">
              Admin
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md shrink-0">
            {user.userid}
          </span>
          {siteCount !== null && (
            <span className="text-xs text-gray-400 shrink-0">
              {siteCount} site{siteCount !== 1 ? "s" : ""}
            </span>
          )}
          {pageCount !== null && (
            <span className="text-xs text-gray-400 shrink-0">
              {pageCount} page{pageCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
      <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}

function apiErrorMessage(err, fallback) {
  const d = err?.response?.data;
  if (typeof d === "string") return d;
  if (d?.message) return d.message;
  if (d?.error) return d.error;
  return err?.message || fallback;
}

export default function UserListing({
  handleCreate,
  users,
  handleSelectUser,
  loading,
  error,
  onRetry,
  onDismissError,
}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const allUsers = users ?? [];

  const filteredUsers = useMemo(() => {
    const q = (search ?? "").toLowerCase();
    if (!q) return allUsers;
    return allUsers.filter(
      (u) =>
        String(u.userid ?? "").toLowerCase().includes(q) ||
        String(u.username ?? "").toLowerCase().includes(q)
    );
  }, [search, allUsers]);

  const isFiltered = search.length > 0;
  const hasUsers = allUsers.length > 0;
  const hasResults = filteredUsers.length > 0;

  return (
    <>
      {error && (
        <div
          className="mb-4 rounded-xl bg-red-50 border border-red-100 text-red-800 px-4 py-3 text-sm flex flex-wrap items-center justify-between gap-2"
          role="alert"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{apiErrorMessage(error, t("userListing.loadError"))}</span>
          </div>
          <div className="flex gap-3 shrink-0">
            {onRetry && (
              <button type="button" className="text-sm font-medium text-red-900 underline" onClick={onRetry}>{t("common.retry")}</button>
            )}
            {onDismissError && (
              <button type="button" className="text-sm font-medium text-red-900 underline" onClick={onDismissError}>{t("common.dismiss")}</button>
            )}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <SearchBar value={search} onChange={setSearch} placeholder={t("userListing.searchPlaceholder")} />
        </div>
        <div className="shrink-0">
          <Button onClick={handleCreate}>
            <span className="hidden sm:inline">+ {t("userListing.addUser")}</span>
            <span className="sm:hidden">+ {t("actions.add")}</span>
          </Button>
        </div>
      </div>

      {/* Result count */}
      {!loading && hasUsers && (
        <p className="text-xs text-gray-400 mb-3">
          {isFiltered
            ? t("userListing.showingFiltered", { filtered: filteredUsers.length, total: allUsers.length })
            : t("userListing.totalUsers", { total: allUsers.length })}
        </p>
      )}

      {/* No users yet */}
      {!loading && !hasUsers && (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center border border-dashed border-gray-200 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="font-medium text-gray-600">{t("userListing.emptyTitle")}</p>
          <p className="text-sm text-gray-400 mt-1">{t("userListing.emptySubtitle")}</p>
          <Button className="mt-4" onClick={handleCreate}>+ {t("userListing.addUser")}</Button>
        </div>
      )}

      {/* No search results */}
      {!loading && hasUsers && !hasResults && (
        <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center border border-dashed border-gray-200 rounded-2xl">
          <p className="text-2xl mb-2">🔍</p>
          <p className="font-medium text-gray-600">{t("userListing.noMatches", { search })}</p>
          <p className="text-sm text-gray-400 mt-1">{t("userListing.tryDifferentSearch")}</p>
        </div>
      )}

      <Listing>
        {loading
          ? [...Array(12)].map((_, i) => <CardSkeleton key={i} />)
          : filteredUsers.map((user) => (
              <UserCard
                key={user.userid}
                user={user}
                onClick={() => handleSelectUser(user.userid)}
              />
            ))}
      </Listing>
    </>
  );
}
