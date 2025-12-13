import React, { useEffect, useState } from "react";
import AddEditClass from "../components/class/AddEditClass";
import ClassListing from "../components/class/ClassListing";
import Dialog from "../ui-components/Dialog";

import { useCampusStore } from "../store/campus.store";
import { useClassStore } from "../store/class.store";
import { MODE } from "../utils/constants/globalConstants";

export default function Class() {
  const [mode, setMode] = useState(MODE.NONE); // 0 -> close , 1 -> create mode , 2 -> edit mode
  const [selectedClass, setSelectedClass] = useState("");
  const {campuses,fetchCampuses} = useCampusStore()
  const {classes,fetchClasses} = useClassStore()
  const [selectedCampus,setSelectedCampus] = useState("")

  function handleSelectClass(class_id) {
    setSelectedClass(class_id);
    setMode(MODE.EDIT);
  }

  useEffect(() => {
    fetchCampuses()
  }, []);

  useEffect(()=>{
    if(!selectedCampus) return
    fetchClasses(selectedCampus)
  },[selectedCampus])

  function handleAddEditModel(val) {
    setMode(val);

    if (val === MODE.NONE || val === MODE.CREATE) {
      setSelectedClass("");
    }
  }

  return (
    <>
      {mode ? (
        <Dialog
          open={mode}
          fullScreen={true}
          onClose={() => handleAddEditModel(MODE.NONE)}
        >
          <AddEditClass selectedClass={selectedClass} mode={mode} campus_id = {selectedCampus} handleAddEditModel={handleAddEditModel} />
        </Dialog>
      ) : (
        <ClassListing
          handleCreate={() => handleAddEditModel(1)}
          classes={classes}
          handleSelectClass={handleSelectClass}
          allCampus={campuses}
          selectedCampus={selectedCampus}
          setSelectedCampus={setSelectedCampus}
        />
      )}
    </>
  );
}
