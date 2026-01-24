import React, { useEffect, useState } from "react";
import AddEditSection from "../components/section/AddEditSection";
import SectionListing from "../components/section/SectionListing";
import { useCampusStore } from "../store/campus.store";
import { useClassStore } from "../store/class.store";
import { useSectionStore } from "../store/section.store";
import Dialog from "../ui-components/Dialog";
import { MODE } from "../utils/constants/globalConstants";

export default function Section() {
  const [mode, setMode] = useState(MODE.NONE); // 0 -> close , 1 -> create mode , 2 -> edit mode
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("");

  const { fetchCampuses, campuses ,fetchCampusDetails} = useCampusStore();
  const { fetchSections, sections } = useSectionStore();
  const { fetchClasses, classes } = useClassStore();

  function handleSelectSection(section_id) {
    setSelectedSection(section_id);
    setMode(MODE.EDIT);
  }

  useEffect(() => {
    fetchCampuses();
  }, []);

  useEffect(() => {
    if (!selectedCampus) return;
    fetchCampusDetails(selectedCampus)
    fetchSections(selectedCampus);
    fetchClasses(selectedCampus);
  }, [selectedCampus]);

  function handleAddEditModel(val) {
    setMode(val);

    if (val === MODE.NONE || val === MODE.CREATE) {
      setSelectedSection("");
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
          <AddEditSection
            selectedSection={selectedSection}
            mode={mode}
            classes={classes}
            handleAddEditModel={handleAddEditModel}
            campus_id = {selectedCampus}
          />
        </Dialog>
      ) : (
        <SectionListing
          handleCreate={() => handleAddEditModel(MODE.CREATE)}
          sections={sections}
          handleSelectSection={handleSelectSection}
          campuses={campuses}
          selectedCampus={selectedCampus}
          setSelectedCampus={setSelectedCampus}
        />
      )}
    </>
  );
}
