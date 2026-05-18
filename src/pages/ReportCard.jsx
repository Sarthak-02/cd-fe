import React, { useEffect, useMemo, useState } from "react";
import ReportCardListing from "../components/report-card/ReportCardListing";
import ReportCardPreview from "../components/report-card/ReportCardPreview";
import Dialog from "../ui-components/Dialog";
import { useCampusStore } from "../store/campus.store";
import { useStudentStore } from "../store/student.store";
import { useSectionStore } from "../store/section.store";
import { useClassStore } from "../store/class.store";
import { useReportCardStore } from "../store/report-card.store";

export default function ReportCard() {
  const [selectedCampus, setSelectedCampus] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedExams, setSelectedExams] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { campuses, campusDetails, fetchCampuses, fetchCampusDetails } = useCampusStore();
  const { students, loading, error, fetchStudents, clearStudentError } = useStudentStore();
  const { sections, fetchSections } = useSectionStore();
  const { classes, fetchClasses } = useClassStore();
  const { reportCards, generating, fetchReportCards, clearReportCards, clearError } =
    useReportCardStore();

  const campusOptions = useMemo(
    () => (campuses ?? []).map((c) => ({ label: c.campus_name, value: c.campus_id })),
    [campuses]
  );

  const examOptions = useMemo(
    () =>
      (campusDetails?.extras?.campus_exam_types ?? []).map((type) => ({
        label: type,
        value: type,
      })),
    [campusDetails]
  );

  const sectionMap = useMemo(() => {
    const secNameById = {};
    (sections ?? []).forEach((s) => { secNameById[s.section_id] = s.section_name; });
    const map = {};
    (students ?? []).forEach((st) => {
      if (st.student_section_id) {
        map[st.student_id] = secNameById[st.student_section_id] ?? null;
      }
    });
    return map;
  }, [students, sections]);

  // Filter each card's items to only the selected exam types
  const filteredReportCards = useMemo(
    () =>
      reportCards.map((card) => ({
        ...card,
        items: (card.items ?? []).filter((item) =>
          selectedExams.includes(item.exam_name)
        ),
      })),
    [reportCards, selectedExams]
  );

  const dialogTitle = useMemo(() => {
    if (!selectedExams.length) return "Report Cards";
    if (selectedExams.length === 1) return `Report Cards — ${selectedExams[0]}`;
    return `Report Cards — ${selectedExams.join(", ")}`;
  }, [selectedExams]);

  useEffect(() => {
    fetchCampuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedCampus) return;
    fetchCampusDetails(selectedCampus);
    fetchStudents(selectedCampus);
    fetchSections(selectedCampus);
    fetchClasses(selectedCampus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCampus]);

  async function handleGenerate() {
    if (!selectedStudentIds.length || !selectedExams.length) return;
    try {
      await fetchReportCards(selectedStudentIds);
      setPreviewOpen(true);
    } catch {
      // error stored in the store
    }
  }

  function handleClosePreview() {
    setPreviewOpen(false);
    clearReportCards();
    clearError();
  }

  return (
    <>
      <ReportCardListing
        students={students}
        loading={loading}
        error={error}
        onRetry={() => selectedCampus && fetchStudents(selectedCampus)}
        onDismissError={clearStudentError}
        campuses={campusOptions}
        selectedCampus={selectedCampus}
        setSelectedCampus={(val) => {
          setSelectedCampus(val);
          setSelectedExams([]);
        }}
        classes={classes}
        sections={sections}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
        exams={examOptions}
        selectedExams={selectedExams}
        setSelectedExams={setSelectedExams}
        selectedStudentIds={selectedStudentIds}
        setSelectedStudentIds={setSelectedStudentIds}
        onGenerate={handleGenerate}
        generating={generating}
      />

      {previewOpen && (
        <Dialog
          open={previewOpen}
          fullScreen={true}
          onClose={handleClosePreview}
          title={dialogTitle}
        >
          <ReportCardPreview
            reportCards={filteredReportCards}
            campusDetails={campusDetails}
            sectionMap={sectionMap}
          />
        </Dialog>
      )}
    </>
  );
}
