import React, { useEffect, useMemo, useState } from "react";
import AddEditClass from "../components/class/AddEditClass";
import ClassListing from "../components/class/ClassListing";
import Dialog from "../ui-components/Dialog";

import { useCampusStore } from "../store/campus.store";
import { useClassStore } from "../store/class.store";
import { MODE } from "../utils/constants/globalConstants";
import { useTranslation } from "react-i18next";

export default function Class() {
  const { t } = useTranslation();
  const [mode, setMode] = useState(MODE.NONE);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("");

  const { campuses, fetchCampuses } = useCampusStore();

  const campusOptions = useMemo(
    () => (campuses ?? []).map((c) => ({ label: c.campus_name, value: c.campus_id })),
    [campuses]
  );
  const {
    classes,
    loading,
    error,
    fetchClasses,
    clearClassDetails,
    clearClassError,
  } = useClassStore();

  useEffect(() => {
    fetchCampuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- zustand store action
  }, []);

  useEffect(() => {
    if (!selectedCampus) return;
    fetchClasses(selectedCampus);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- zustand store action
  }, [selectedCampus]);

  function handleSelectClass(class_id) {
    clearClassDetails();
    clearClassError();
    setSelectedClass(class_id);
    setMode(MODE.EDIT);
  }

  function handleAddEditModel(val) {
    setMode(val);
    clearClassError();

    if (val === MODE.NONE || val === MODE.CREATE) {
      setSelectedClass("");
    }
  }

  return (
    <>
      {mode ? (
        <Dialog
          open={!!mode}
          fullScreen={true}
          onClose={() => handleAddEditModel(MODE.NONE)}
          title={
            mode === MODE.CREATE
              ? `${t("actions.add")} ${t("entities.class")}`
              : `${t("actions.edit")} ${t("entities.class")}`
          }
        >
          <AddEditClass
            selectedClass={selectedClass}
            mode={mode}
            campus_id={selectedCampus}
            handleAddEditModel={handleAddEditModel}
          />
        </Dialog>
      ) : (
        <ClassListing
          handleCreate={() => handleAddEditModel(MODE.CREATE)}
          classes={classes}
          loading={loading}
          error={error}
          onRetry={() => selectedCampus && fetchClasses(selectedCampus)}
          onDismissError={clearClassError}
          handleSelectClass={handleSelectClass}
          allCampus={campusOptions}
          selectedCampus={selectedCampus}
          setSelectedCampus={setSelectedCampus}
        />
      )}
    </>
  );
}
