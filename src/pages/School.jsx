import React, { useEffect, useState } from "react";
import AddEditSchool from "../components/school/AddEditSchool";
import SchoolListing from "../components/school/SchoolListing";
import Dialog from "../ui-components/Dialog";
import { getAllSchoolApi } from "../api/school.api";

export default function School() {
  // const [openAddEdit, setOpenAddEdit] = useState(false);
  const [mode, setMode] = useState(0); // 0 -> close ,  1 -> create mode , 2--> edit mode
  const [selectedSchool, setSelectedSchool] = useState("");
  const [allSchools, setAllSchools] = useState([]);

  function handleSelectSchool(school_id) {
    setSelectedSchool(school_id);
    setMode(2);
  }

  useEffect(() => {
      getAllSchoolApi()
        .then((resp) => {
          setAllSchools(resp.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);

  function handleAddEditModel(val) {
    setMode(val);

    if (val === 0 || val === 1) {
      setSelectedSchool("");
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
          <AddEditSchool selectedSchool={selectedSchool} mode={mode} />
        </Dialog>
      ) : (
        <SchoolListing handleCreate={() => handleAddEditModel(1)} schools={allSchools} handleSelectSchool={handleSelectSchool} />
      )}
    </>
  );
}
