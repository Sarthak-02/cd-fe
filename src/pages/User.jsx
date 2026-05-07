import { useEffect, useState } from "react";
import AddEditUser from "../components/user/AddEditUser";
import UserListing from "../components/user/UserListing";
import Dialog from "../ui-components/Dialog";

import { MODE } from "../utils/constants/globalConstants";
import { useUsersStore } from "../store/user.store";
import { useSchoolsStore } from "../store/school.store";
import { useTranslation } from "react-i18next";

export default function User() {
  const { t } = useTranslation();
  const [mode, setMode] = useState(MODE.NONE);
  const [selectedUser, setSelectedUser] = useState("");

  const {
    users,
    loading,
    error,
    fetchUsers,
    clearUserDetails,
    clearUserError,
  } = useUsersStore();
  const { fetchSchools } = useSchoolsStore();

  useEffect(() => {
    fetchUsers();
    fetchSchools();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- zustand store actions
  }, []);

  function handleSelectUser(userid) {
    clearUserDetails();
    clearUserError();
    setSelectedUser(userid);
    setMode(MODE.EDIT);
  }

  function handleAddEditModel(val) {
    setMode(val);
    clearUserError();

    if (val === MODE.NONE || val === MODE.CREATE) {
      setSelectedUser("");
      clearUserDetails();
    }
  }

  return (
    <>
      {mode ? (
        <Dialog
          open={!!mode}
          fullScreen={true}
          onClose={() => handleAddEditModel(MODE.NONE)}
          title={
            mode === MODE.CREATE
              ? `${t("actions.create")} ${t("entities.user")}`
              : `${t("actions.edit")} ${t("entities.user")}`
          }
        >
          <AddEditUser
            mode={mode}
            selectedUser={selectedUser}
            handleAddEditModel={handleAddEditModel}
          />
        </Dialog>
      ) : (
        <UserListing
          handleCreate={() => handleAddEditModel(MODE.CREATE)}
          users={users}
          handleSelectUser={handleSelectUser}
          loading={loading}
          error={error}
          onRetry={() => fetchUsers()}
          onDismissError={clearUserError}
        />
      )}
    </>
  );
}
