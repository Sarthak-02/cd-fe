import React, { useEffect, useState } from "react";
import AddEditSection from "../components/section/AddEditSection";
import SectionListing from "../components/section/SectionListing";
import { useCampusStore } from "../store/campus.store";
import { useClassStore } from "../store/class.store";
import { useSectionStore } from "../store/section.store";
import Dialog from "../ui-components/Dialog";
import { MODE } from "../utils/constants/globalConstants";

export default function Section() {
  const [mode, setMode] = useState(MODE.NONE);
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("");

  const { fetchCampuses, campuses, fetchCampusDetails } = useCampusStore();
  const {
    fetchSections,
    sections,
    loading,
    error,
    clearSectionDetails,
    clearSectionError,
  } = useSectionStore();
  const { fetchClasses, classes } = useClassStore();

  useEffect(() => {
    fetchCampuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- zustand store action
  }, []);

  useEffect(() => {
    if (!selectedCampus) return;
    fetchCampusDetails(selectedCampus);
    fetchSections(selectedCampus);
    fetchClasses(selectedCampus);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- zustand store actions
  }, [selectedCampus]);

  function handleSelectSection(section_id) {
    clearSectionDetails();
    clearSectionError();
    setSelectedSection(section_id);
    setMode(MODE.EDIT);
  }

  function handleAddEditModel(val) {
    setMode(val);
    clearSectionError();

    if (val === MODE.NONE || val === MODE.CREATE) {
      setSelectedSection("");
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
          <AddEditSection
            selectedSection={selectedSection}
            mode={mode}
            classes={classes}
            handleAddEditModel={handleAddEditModel}
            campus_id={selectedCampus}
          />
        </Dialog>
      ) : (
        <SectionListing
          handleCreate={() => handleAddEditModel(MODE.CREATE)}
          sections={sections}
          loading={loading}
          error={error}
          onRetry={() => selectedCampus && fetchSections(selectedCampus)}
          onDismissError={clearSectionError}
          handleSelectSection={handleSelectSection}
          campuses={campuses}
          selectedCampus={selectedCampus}
          setSelectedCampus={setSelectedCampus}
        />
      )}
    </>
  );
}
