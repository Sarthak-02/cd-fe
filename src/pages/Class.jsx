import React, { useEffect, useState } from "react";
import AddEditClass from "../components/class/AddEditClass";
import ClassListing from "../components/class/ClassListing";
import Dialog from "../ui-components/Dialog";
import { getAllClassApi } from "../api/class.api";

export default function Class() {
  const [mode, setMode] = useState(0); // 0 -> close , 1 -> create mode , 2 -> edit mode
  const [selectedClass, setSelectedClass] = useState("");
  const [allClasses, setAllClasses] = useState([]);

  function handleSelectClass(class_id) {
    setSelectedClass(class_id);
    setMode(2);
  }

  useEffect(() => {
    getAllClassApi()
      .then((resp) => {
        setAllClasses(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleAddEditModel(val) {
    setMode(val);

    if (val === 0 || val === 1) {
      setSelectedClass("");
    }
  }

  return (
    <>
      {mode ? (
        <Dialog
          open={mode}
          fullScreen={true}
          onClose={() => handleAddEditModel(0)}
        >
          <AddEditClass selectedClass={selectedClass} mode={mode} />
        </Dialog>
      ) : (
        <ClassListing
          handleCreate={() => handleAddEditModel(1)}
          classes={allClasses}
          handleSelectClass={handleSelectClass}
        />
      )}
    </>
  );
}
