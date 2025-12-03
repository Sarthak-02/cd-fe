import { useEffect, useState } from "react";
import AddEditUser from "../components/user/AddEditUser";
import UserListing from "../components/user/UserListing";
import Dialog from "../ui-components/Dialog";

import { MODE } from "../utils/constants/basic";
import { useUsersStore } from "../store/user.store";
import { useSchoolsStore } from "../store/school.store";
//get all pages
//get all sites

export default function School() {
  const [mode, setMode] = useState(MODE.NONE); // 0 -> close ,  1 -> create mode , 2--> edit mode
  const [selectedUser, setSelectedUser] = useState("");

  const { users, loading, fetchUsers , clearUserDetails} = useUsersStore();
  const {fetchSchools,schools} = useSchoolsStore()

  useEffect(() => {
    fetchUsers();
    fetchSchools()
  }, []);

  function handleSelectUser(userid) {
    setSelectedUser(userid);
    setMode(MODE.EDIT);
  }

  function handleAddEditModel(val) {
    setMode(val);

    if (val === MODE.NONE || val === MODE.CREATE) {
      setSelectedUser("");
      clearUserDetails()
    }

  }


  return (
    <>
      {mode ? (
        <Dialog
          open={!!mode}
          fullScreen={true}
          onClose={() => handleAddEditModel(MODE.NONE)}
        >
          <AddEditUser mode={mode} selectedUser={selectedUser} handleAddEditModel={handleAddEditModel} all_sites={schools} />
        </Dialog>
      ) : (
        <UserListing
          handleCreate={() => handleAddEditModel(MODE.CREATE)}
          users={users}
          handleSelectUser={handleSelectUser}
          loading={loading}
          // error={error}
        />
      )}
    </>
  );
}
