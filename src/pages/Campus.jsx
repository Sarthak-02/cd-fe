import React, { useEffect, useState } from "react";
import AddEditCampus from "../components/campus/AddEditCampus";
import CampusListing from "../components/campus/CampusListing";
import Dialog from "../ui-components/Dialog";
import { getAllCampusApi } from "../api/campus.api";

export default function Campus() {
  const [mode, setMode] = useState(0); // 0 -> close ,  1 -> create mode , 2 -> edit mode
  const [selectedCampus, setSelectedCampus] = useState("");
  const [allCampuses, setAllCampuses] = useState([]);

  function handleSelectCampus(campus_id) {
    setSelectedCampus(campus_id);
    setMode(2);
  }

  useEffect(() => {
    getAllCampusApi()
      .then((resp) => {
        setAllCampuses(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleAddEditModel(val) {
    setMode(val);

    if (val === 0 || val === 1) {
      setSelectedCampus("");
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
          <AddEditCampus selectedCampus={selectedCampus} mode={mode} />
        </Dialog>
      ) : (
        <CampusListing
          handleCreate={() => handleAddEditModel(1)}
          campuses={allCampuses}
          handleSelectCampus={handleSelectCampus}
        />
      )}
    </>
  );
}
