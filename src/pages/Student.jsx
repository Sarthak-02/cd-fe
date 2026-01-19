import React, { useEffect, useState } from "react";
import AddEditStudent from "../components/student/AddEditStudent";
import StudentListing from "../components/student/StudentListing";
import Dialog from "../ui-components/Dialog";
import { MODE } from "../utils/constants/globalConstants";

import { useCampusStore } from "../store/campus.store";
import { useStudentStore } from "../store/student.store";
import { useSectionStore } from "../store/section.store";
import { useClassStore } from "../store/class.store";

export default function Student() {
  const [mode, setMode] = useState(MODE.NONE); // 0 -> close, 1 -> create, 2 -> edit
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("");

  const { fetchCampuses, campuses,fetchCampusDetails,campusDetails } = useCampusStore();
  const { fetchStudents, students } = useStudentStore();
  const { fetchSections } = useSectionStore();
  const { fetchClasses } = useClassStore();
  /** ---------------------------
   * Select a student from listing
   ----------------------------*/
  function handleSelectStudent(student_id) {
    setSelectedStudent(student_id);
    setMode(MODE.EDIT);
  }

  /** ---------------------------
   * Load campuses on mount
   ----------------------------*/
  useEffect(() => {
    fetchCampuses();
  }, []);

  /** ------------------------------------------
   * Load students when campus is selected
   -------------------------------------------*/
  useEffect(() => {
    if (!selectedCampus) return;
    fetchCampusDetails(selectedCampus);
    fetchStudents(selectedCampus);
    fetchSections(selectedCampus);
    fetchClasses(selectedCampus);
  }, [selectedCampus]);

  /** ---------------------------
   * Handle Add/Edit Modal
   ----------------------------*/
  function handleAddEditModel(val) {
    setMode(val);

    if (val === MODE.NONE || val === MODE.CREATE) {
      setSelectedStudent("");
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
          <AddEditStudent
            selectedStudent={selectedStudent}
            mode={mode}
            campus_id={selectedCampus}
            handleAddEditModel={handleAddEditModel}
            campusDetails={campusDetails}
          />
        </Dialog>
      ) : (
        <StudentListing
          handleCreate={() => handleAddEditModel(MODE.CREATE)}
          students={students}
          handleSelectStudent={handleSelectStudent}
          campuses={campuses}
          selectedCampus={selectedCampus}
          setSelectedCampus={setSelectedCampus}
        />
      )}
    </>
  );
}
