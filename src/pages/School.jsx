import { useEffect, useState } from "react";
import AddEditSchool from "../components/school/AddEditSchool";
import SchoolListing from "../components/school/SchoolListing";
import Dialog from "../ui-components/Dialog";

import { MODE } from "../utils/constants/globalConstants";
import { useSchoolsStore } from "../store/school.store";

export default function School() {
  const [mode, setMode] = useState(MODE.NONE); // 0 -> close , 1 -> create , 2 -> edit
  const [selectedSchool, setSelectedSchool] = useState("");

  const {
    schools,
    loading,
    error,
    fetchSchools,
    clearSchoolDetails,
    clearSchoolError,
  } = useSchoolsStore();

  useEffect(() => {
    fetchSchools();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- zustand store action
  }, []);

  function handleSelectSchool(school_id) {
    clearSchoolDetails();
    clearSchoolError();
    setSelectedSchool(school_id);
    setMode(MODE.EDIT);
  }

  function handleAddEditModel(val) {
    setMode(val);
    clearSchoolError();

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
          title={mode === MODE.CREATE ? "Add School" : "Edit School"}
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
          error={error}
          onRetry={() => fetchSchools()}
          onDismissError={clearSchoolError}
          handleSelectSchool={handleSelectSchool}
        />
      )}
    </>
  );
}
