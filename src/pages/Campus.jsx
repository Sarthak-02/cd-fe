import { useEffect, useState } from "react";
import AddEditCampus from "../components/campus/AddEditCampus";
import CampusListing from "../components/campus/CampusListing";
import Dialog from "../ui-components/Dialog";

import { MODE } from "../utils/constants/basic";
import { useCampusStore } from "../store/campus.store";
import { useAuth } from "../store/auth.store";

export default function Campus() {
  const [mode, setMode] = useState(MODE.NONE); // 0 -> close , 1 -> create , 2 -> edit
  const [selectedCampus, setSelectedCampus] = useState("");

  const { campuses, loading, fetchCampuses, clearCampusDetails } =
    useCampusStore();

   const {auth:{site_permissions}} = useAuth()
  // -----------------------------
  // Load all campuses on mount
  // -----------------------------
  useEffect(() => {
    fetchCampuses();
  }, []);

  // -----------------------------
  // When user selects a campus row
  // -----------------------------
  function handleSelectCampus(campus_id) {
    setSelectedCampus(campus_id);
    setMode(MODE.EDIT);
  }

  // -----------------------------
  // Handles opening & closing modal
  // -----------------------------
  function handleAddEditModel(val) {
    setMode(val);

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
        >
          <AddEditCampus
            mode={mode}
            selectedCampus={selectedCampus}
            handleAddEditModel={handleAddEditModel}
          />
        </Dialog>
      ) : (
        <CampusListing
          handleCreate={() => handleAddEditModel(MODE.CREATE)}
          campuses={campuses}
          loading={loading}
          handleSelectCampus={handleSelectCampus}
          allSchools={site_permissions}
        />
      )}
    </>
  );
}
