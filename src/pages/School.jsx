import { useEffect, useState } from "react";
import AddEditSchool from "../components/school/AddEditSchool";
import SchoolListing from "../components/school/SchoolListing";
import Dialog from "../ui-components/Dialog";

import { MODE } from "../utils/constants/basic";
import { useSchoolsStore } from "../store/school.store";

export default function School() {
  const [mode, setMode] = useState(MODE.NONE); // 0 -> close , 1 -> create , 2 -> edit
  const [selectedSchool, setSelectedSchool] = useState("");

  const { schools, loading, fetchSchools, clearSchoolDetails } = useSchoolsStore();

  // Load all schools on mount
  useEffect(() => {
    fetchSchools();
  }, []);

  /** -----------------------------
   * When user selects a school row
   * ----------------------------- */
  function handleSelectSchool(school_id) {
    setSelectedSchool(school_id);
    setMode(MODE.EDIT);
  }

  /** -----------------------------
   * Handles opening & closing modal
   * ----------------------------- */
  function handleAddEditModel(val) {
    setMode(val);

    if (val === MODE.NONE || val === MODE.CREATE) {
      setSelectedSchool("");
      clearSchoolDetails();
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
          <AddEditSchool
            mode={mode}
            selectedSchool={selectedSchool}
            handleAddEditModel={handleAddEditModel}
          />
        </Dialog>
      ) : (
        <SchoolListing
          handleCreate={() => handleAddEditModel(MODE.CREATE)}
          schools={schools}
          loading={loading}
          handleSelectSchool={handleSelectSchool}
        />
      )}
    </>
  );
}
