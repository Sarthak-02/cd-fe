import React, { useEffect, useMemo, useState } from "react";
import IdCardListing from "../components/id-card/IdCardListing";
import IdCardPreview from "../components/id-card/IdCardPreview";
import Dialog from "../ui-components/Dialog";
import { useCampusStore } from "../store/campus.store";
import { useStudentStore } from "../store/student.store";
import { useSectionStore } from "../store/section.store";
import { useClassStore } from "../store/class.store";

export default function IdCard() {
  const [selectedCampus, setSelectedCampus] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { campuses, campusDetails, fetchCampuses, fetchCampusDetails } = useCampusStore();
  const { students, loading, error, fetchStudents, clearStudentError } = useStudentStore();
  const { sections, fetchSections } = useSectionStore();
  const { classes, fetchClasses } = useClassStore();

  const campusOptions = useMemo(
    () => (campuses ?? []).map((c) => ({ label: c.campus_name, value: c.campus_id })),
    [campuses]
  );

  const sectionMap = useMemo(() => {
    const m = {};
    (sections ?? []).forEach((s) => { m[s.section_id] = s.section_name; });
    return m;
  }, [sections]);

  const selectedStudents = useMemo(
    () => (students ?? []).filter((s) => selectedStudentIds.includes(s.student_id)),
    [students, selectedStudentIds]
  );

  useEffect(() => {
    fetchCampuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (campuses?.length === 1) {
      setSelectedCampus(campuses[0].campus_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- auto-select only when campuses loads
  }, [campuses]);

  useEffect(() => {
    if (!selectedCampus) return;
    fetchCampusDetails(selectedCampus);
    fetchStudents(selectedCampus);
    fetchSections(selectedCampus);
    fetchClasses(selectedCampus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCampus]);

  function handleGenerate() {
    if (!selectedStudentIds.length) return;
    setPreviewOpen(true);
  }

  function handleClosePreview() {
    setPreviewOpen(false);
  }

  return (
    <>
      <IdCardListing
        students={students}
        loading={loading}
        error={error}
        onRetry={() => selectedCampus && fetchStudents(selectedCampus)}
        onDismissError={clearStudentError}
        campuses={campusOptions}
        selectedCampus={selectedCampus}
        setSelectedCampus={(val) => {
          setSelectedCampus(val);
          setSelectedStudentIds([]);
        }}
        classes={classes}
        sections={sections}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
        selectedStudentIds={selectedStudentIds}
        setSelectedStudentIds={setSelectedStudentIds}
        onGenerate={handleGenerate}
      />

      {previewOpen && (
        <Dialog
          open={previewOpen}
          fullScreen={true}
          onClose={handleClosePreview}
          title="Student ID Cards"
        >
          <IdCardPreview
            students={selectedStudents}
            campusDetails={campusDetails}
            sectionMap={sectionMap}
          />
        </Dialog>
      )}
    </>
  );
}
