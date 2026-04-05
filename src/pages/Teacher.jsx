import React, { useEffect, useState } from "react";
import AddEditTeacher from "../components/teacher/AddEditTeacher";
import TeacherListing from "../components/teacher/TeacherListing";
import { useCampusStore } from "../store/campus.store";
import { useTeacherStore } from "../store/teacher.store";
import Dialog from "../ui-components/Dialog";
import { MODE } from "../utils/constants/globalConstants";
import { useSectionStore } from "../store/section.store";

export default function Teacher() {
  const [mode, setMode] = useState(MODE.NONE);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("");

  const { fetchCampuses, campuses, fetchCampusDetails } = useCampusStore();
  const {
    fetchTeachers,
    teachers,
    loading,
    error,
    clearTeacherDetails,
    clearTeacherError,
  } = useTeacherStore();
  const { fetchSections } = useSectionStore();

  useEffect(() => {
    fetchCampuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- zustand store action
  }, []);

  useEffect(() => {
    if (!selectedCampus) return;
    fetchCampusDetails(selectedCampus);
    fetchTeachers(selectedCampus);
    fetchSections(selectedCampus);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- zustand store actions
  }, [selectedCampus]);

  function handleSelectTeacher(teacher_id) {
    clearTeacherDetails();
    clearTeacherError();
    setSelectedTeacher(teacher_id);
    setMode(MODE.EDIT);
  }

  function handleAddEditModel(val) {
    setMode(val);
    clearTeacherError();

    if (val === MODE.NONE || val === MODE.CREATE) {
      setSelectedTeacher("");
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
          <AddEditTeacher
            selectedTeacher={selectedTeacher}
            mode={mode}
            campus_id={selectedCampus}
            handleAddEditModel={handleAddEditModel}
          />
        </Dialog>
      ) : (
        <TeacherListing
          handleCreate={() => handleAddEditModel(MODE.CREATE)}
          teachers={teachers}
          loading={loading}
          error={error}
          onRetry={() => selectedCampus && fetchTeachers(selectedCampus)}
          onDismissError={clearTeacherError}
          handleSelectTeacher={handleSelectTeacher}
          campuses={campuses}
          selectedCampus={selectedCampus}
          setSelectedCampus={setSelectedCampus}
        />
      )}
    </>
  );
}
