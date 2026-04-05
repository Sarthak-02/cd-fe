import React, { useMemo, useState } from "react";
import Listing from "../../ui-components/Listing";
import CardSkeleton from "../../ui-components/skeletons/CardSkeleton";
import Card from "../../ui-components/Card";
import SearchBar from "../../ui-components/SearchBar";
import Button from "../../ui-components/Button";

function apiErrorMessage(err) {
  const d = err?.response?.data;
  if (typeof d === "string") return d;
  if (d?.message) return d.message;
  if (d?.error) return d.error;
  return err?.message || "Could not load users.";
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
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const list = users ?? [];
    const q = (search ?? "").toLowerCase();
    if (!q) return list;
    return list.filter(
      (u) =>
        String(u.userid ?? "")
          .toLowerCase()
          .includes(q) ||
        String(u.username ?? "")
          .toLowerCase()
          .includes(q)
    );
  }, [search, users]);

  return (
    <>
      {error && (
        <div
          className="mb-4 rounded-md bg-red-50 text-red-800 px-3 py-2 text-sm flex flex-wrap items-center justify-between gap-2"
          role="alert"
        >
          <span>{apiErrorMessage(error)}</span>
          <div className="flex gap-2 shrink-0">
            {onRetry && (
              <button
                type="button"
                className="text-sm font-medium text-red-900 underline"
                onClick={onRetry}
              >
                Retry
              </button>
            )}
            {onDismissError && (
              <button
                type="button"
                className="text-sm font-medium text-red-900 underline"
                onClick={onDismissError}
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4 gap-5">
        <div className="w-4/5">
          <SearchBar onChange={setSearch} value={search} />
        </div>

        <div className="w-1/5 md:w-2/5 lg:w-1/5 flex justify-end">
          <Button onClick={handleCreate}>Create</Button>
        </div>
      </div>

      <Listing>
        {loading
          ? [...Array(12)].map((_, i) => <CardSkeleton key={i} />)
          : filteredUsers.map((user) => (
              <Card
                key={user.userid}
                title={user.username}
                subtitle={user.userid}
                onClick={() => handleSelectUser(user.userid)}
              />
            ))}
      </Listing>
    </>
  );
}
