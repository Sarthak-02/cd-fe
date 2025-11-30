import { useEffect, useState } from "react";
import UserListing from "../components/user/UserListing";
import AddEditUser from "../components/user/AddEditUser";
import Dialog from "../ui-components/Dialog";
import { getAllUserApi } from "../api/user.api";

//get all pages
//get all sites

export default function School() {
  const [allUsers, setAllUsers] = useState([]);
  const [mode, setMode] = useState(0); // 0 -> close ,  1 -> create mode , 2--> edit mode
  const [selectedUser, setSelectedUser] = useState("");

  function handleSelectUser(userid) {
    setSelectedUser(userid);
    setMode(2);
  }


  useEffect(() => {
    getAllUserApi()
      .then((resp) => {
        setAllUsers(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleAddEditModel(val) {
    setMode(val);

    if(val === 0  || val === 1){
      setSelectedUser("")
    }
  }

  return (
    <>
      {mode ? (
        <Dialog
          open={!!mode}
          fullScreen={true}
          onClose={() => handleAddEditModel(0)}
        >
          <AddEditUser mode={mode} selectedUser={selectedUser} />
        </Dialog>
      ) : (
        <UserListing
          handleCreate={() => handleAddEditModel(1)}
          users={allUsers}
          handleSelectUser={handleSelectUser}
        />
      )}
    </>
  );
}
