import React, { useEffect, useState } from "react";
import AddEditSection from "../components/section/AddEditSection";
import SectionListing from "../components/section/SectionListing";
import Dialog from "../ui-components/Dialog";
import { getAllSectionApi } from "../api/section.api";

export default function Section() {
  const [mode, setMode] = useState(0); // 0 -> close , 1 -> create mode , 2 -> edit mode
  const [selectedSection, setSelectedSection] = useState("");
  const [allSections, setAllSections] = useState([]);

  function handleSelectSection(section_id) {
    setSelectedSection(section_id);
    setMode(2);
  }

  useEffect(() => {
    getAllSectionApi()
      .then((resp) => {
        setAllSections(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleAddEditModel(val) {
    setMode(val);

    if (val === 0 || val === 1) {
      setSelectedSection("");
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
          <AddEditSection selectedSection={selectedSection} mode={mode} />
        </Dialog>
      ) : (
        <SectionListing
          handleCreate={() => handleAddEditModel(1)}
          sections={allSections}
          handleSelectSection={handleSelectSection}
        />
      )}
    </>
  );
}
