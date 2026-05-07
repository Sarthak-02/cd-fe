import { useEffect, useState } from "react";
import AddEditCampus from "../components/campus/AddEditCampus";
import CampusListing from "../components/campus/CampusListing";
import Dialog from "../ui-components/Dialog";

import { MODE } from "../utils/constants/globalConstants";
import { useCampusStore } from "../store/campus.store";
import { useAuth } from "../store/auth.store";

export default function Campus() {
  const [mode, setMode] = useState(MODE.NONE); // 0 -> close , 1 -> create , 2 -> edit
  const [selectedCampus, setSelectedCampus] = useState("");

  // const [selectedSchool,setSelectedSchool] = useState("")

  const {
    campuses,
    loading,
    error,
    fetchCampuses,
    clearCampusDetails,
    clearCampusError,
  } = useCampusStore();

  const {
    auth: {
      site_permissions,
      active_school: { value: selectedSchool },
    },
    setActiveSchool: setSelectedSchool,
  } = useAuth();
  
  // -----------------------------
  // Load all campuses on mount
  // -----------------------------
  useEffect(() => {
    fetchCampuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- zustand store action
  }, []);

  // -----------------------------
  // When user selects a campus row
  // -----------------------------
  function handleSelectCampus(campus_id) {
    clearCampusDetails();
    clearCampusError();
    setSelectedCampus(campus_id);
    setMode(MODE.EDIT);
  }

  // -----------------------------
  // Handles opening & closing modal
  // -----------------------------
  function handleAddEditModel(val) {
    setMode(val);
    clearCampusError();

    if (val === MODE.NONE || val === MODE.CREATE) {
      setSelectedCampus("");
      clearCampusDetails();
    }
  }

  return (
    <>
      {mode ? (
        <Dialog
          open={!!mode}
          fullScreen={true}
          onClose={() => handleAddEditModel(MODE.NONE)}
          title={mode === MODE.CREATE ? "Add Campus" : "Edit Campus"}
        >
          <AddEditCampus
            mode={mode}
            selectedCampus={selectedCampus}
            handleAddEditModel={handleAddEditModel}
            school_id={selectedSchool}
          />
        </Dialog>
      ) : (
        <CampusListing
          handleCreate={() => handleAddEditModel(MODE.CREATE)}
          campuses={campuses}
          loading={loading}
          error={error}
          onRetry={() => fetchCampuses()}
          onDismissError={clearCampusError}
          handleSelectCampus={handleSelectCampus}
          allSchools={site_permissions}
          selectedSchool={selectedSchool}
          setSelectedSchool={setSelectedSchool}
        />
      )}
    </>
  );
}
