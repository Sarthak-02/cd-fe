import React, { useEffect, useState } from "react";
import AddEditTeacher from "../components/teacher/AddEditTeacher";
import TeacherListing from "../components/teacher/TeacherListing";
import { useCampusStore } from "../store/campus.store";
import { useTeacherStore } from "../store/teacher.store";
import Dialog from "../ui-components/Dialog";
import { MODE } from "../utils/constants/globalConstants";
import { useSectionStore } from "../store/section.store";

export default function Teacher() {
  const [mode, setMode] = useState(MODE.NONE); // 0 -> close , 1 -> create mode , 2 -> edit mode
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("");
  const { fetchCampuses, campuses,fetchCampusDetails,campusDetails } = useCampusStore();
  const { fetchTeachers, teachers } = useTeacherStore();
  const {fetchSections} = useSectionStore()

  function handleSelectTeacher(teacher_id) {
    setSelectedTeacher(teacher_id);
    setMode(MODE.EDIT);
  }

  useEffect(() => {
    fetchCampuses();
  }, []);

  useEffect(() => {
    if (!selectedCampus) return;
    //fetch campus detaila for a selected campus
    fetchCampusDetails(selectedCampus);
    fetchTeachers(selectedCampus);
    fetchSections(selectedCampus)
  }, [selectedCampus]);

  function handleAddEditModel(val) {
    setMode(val);

    if (val === MODE.NONE || val === MODE.CREATE) {
      setSelectedTeacher("");
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
          <AddEditTeacher selectedTeacher={selectedTeacher} mode={mode} campus_id={selectedCampus}  handleAddEditModel={handleAddEditModel} campusDetails={campusDetails} />
        </Dialog>
      ) : (
        <TeacherListing
          handleCreate={() => handleAddEditModel(1)}
          teachers={teachers}
          handleSelectTeacher={handleSelectTeacher}
          campuses={campuses}
          selectedCampus={selectedCampus}
          setSelectedCampus={setSelectedCampus}
        />
      )}
    </>
  );
}
