import React, { useEffect, useMemo, useState } from "react";
import AddEditStudent from "../components/student/AddEditStudent";
import StudentListing from "../components/student/StudentListing";
import Dialog from "../ui-components/Dialog";
import { MODE } from "../utils/constants/globalConstants";
import { useTranslation } from "react-i18next";

import { useCampusStore } from "../store/campus.store";
import { useStudentStore } from "../store/student.store";
import { useSectionStore } from "../store/section.store";
import { useClassStore } from "../store/class.store";

export default function Student() {
  const { t } = useTranslation();
  const [mode, setMode] = useState(MODE.NONE);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("");

  const { fetchCampuses, campuses, fetchCampusDetails } = useCampusStore();

  const campusOptions = useMemo(
    () => (campuses ?? []).map((c) => ({ label: c.campus_name, value: c.campus_id })),
    [campuses]
  );
  const {
    fetchStudents,
    students,
    loading,
    error,
    clearStudentDetails,
    clearStudentError,
  } = useStudentStore();
  const { fetchSections } = useSectionStore();
  const { fetchClasses } = useClassStore();

  function handleSelectStudent(student_id) {
    clearStudentDetails();
    clearStudentError();
    setSelectedStudent(student_id);
    setMode(MODE.EDIT);
  }

  useEffect(() => {
    fetchCampuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- zustand store action
  }, []);

  useEffect(() => {
    if (!selectedCampus) return;
    fetchCampusDetails(selectedCampus);
    fetchStudents(selectedCampus);
    fetchSections(selectedCampus);
    fetchClasses(selectedCampus);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- zustand store actions
  }, [selectedCampus]);

  function handleAddEditModel(val) {
    setMode(val);
    clearStudentError();

    if (val === MODE.NONE || val === MODE.CREATE) {
      setSelectedStudent("");
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
              ? `${t("actions.add")} ${t("entities.student")}`
              : `${t("actions.edit")} ${t("entities.student")}`
          }
        >
          <AddEditStudent
            selectedStudent={selectedStudent}
            mode={mode}
            campus_id={selectedCampus}
            handleAddEditModel={handleAddEditModel}
          />
        </Dialog>
      ) : (
        <StudentListing
          handleCreate={() => handleAddEditModel(MODE.CREATE)}
          students={students}
          loading={loading}
          error={error}
          onRetry={() => selectedCampus && fetchStudents(selectedCampus)}
          onDismissError={clearStudentError}
          handleSelectStudent={handleSelectStudent}
          campuses={campusOptions}
          selectedCampus={selectedCampus}
          setSelectedCampus={setSelectedCampus}
        />
      )}
    </>
  );
}
