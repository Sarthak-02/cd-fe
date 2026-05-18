import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../ui-components/Button";

// ── Helpers ────────────────────────────────────────────────────────────────

function isPassing(obtained, passing) {
  return parseFloat(obtained) >= parseFloat(passing);
}

function toPercent(obtained, max) {
  if (!max) return null;
  return ((parseFloat(obtained) / parseFloat(max)) * 100).toFixed(1);
}


function groupByExam(items) {
  const map = new Map();
  for (const item of items) {
    if (!map.has(item.exam_id)) {
      map.set(item.exam_id, { exam_id: item.exam_id, exam_name: item.exam_name, subjects: [] });
    }
    map.get(item.exam_id).subjects.push(item);
  }
  return Array.from(map.values());
}

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function buildAddress(d) {
  return [d?.address_line, d?.city, d?.state, d?.pincode]
    .filter(Boolean)
    .join(", ");
}

// ── Single Report Card ─────────────────────────────────────────────────────

function SingleReportCard({ card, campusDetails, sectionName }) {
  const { t } = useTranslation();
  const { student, items } = card;
  const exams = useMemo(() => groupByExam(items ?? []), [items]);

  const address = buildAddress(campusDetails);
  const termStart = formatDate(campusDetails?.term_start_date);
  const termEnd = formatDate(campusDetails?.term_end_date);

  return (
    <div className="report-card bg-white border-2 border-gray-800 mb-8 print:mb-0 print:page-break-after-always font-sans">

      {/* ── School Header ── */}
      <div className="border-b-2 border-gray-800 p-6 text-center">
        {/* Logo placeholder */}
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center bg-gray-50">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold tracking-wide text-gray-900 uppercase">
          {campusDetails?.campus_name || "School Name"}
        </h1>

        {campusDetails?.campus_type && (
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-0.5">
            {campusDetails.campus_type}
          </p>
        )}

        {address && (
          <p className="text-sm text-gray-600 mt-1">{address}</p>
        )}

        <div className="flex items-center justify-center gap-4 mt-1.5 flex-wrap">
          {campusDetails?.email && (
            <span className="text-xs text-gray-500">✉ {campusDetails.email}</span>
          )}
          {campusDetails?.mobile_admin && (
            <span className="text-xs text-gray-500">✆ {campusDetails.mobile_admin}</span>
          )}
          {campusDetails?.phone_landline && (
            <span className="text-xs text-gray-500">✆ {campusDetails.phone_landline}</span>
          )}
        </div>

        {/* Report title strip */}
        <div className="mt-4 py-1.5 bg-gray-900 text-white">
          <p className="text-sm font-bold tracking-[0.2em] uppercase">
            {t("reportCard.preview.academicProgressReport")}
          </p>
        </div>

        {termStart && termEnd && (
          <p className="text-xs text-gray-500 mt-2">
            {t("reportCard.preview.academicTerm")}: {termStart} — {termEnd}
          </p>
        )}
      </div>

      {/* ── Student Info ── */}
      <div className="border-b border-gray-300 p-4 bg-gray-50">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3">
          <InfoCell label={t("reportCard.preview.studentName")} value={student.name} span />
          <InfoCell label={t("reportCard.preview.admissionNo")} value={student.admission_number} mono />
          <InfoCell label={t("reportCard.preview.rollNo")} value={student.roll_number ?? "—"} />
          {sectionName && <InfoCell label={t("reportCard.preview.classSection")} value={sectionName} />}
          <InfoCell
            label={t("reportCard.preview.dateOfIssue")}
            value={formatDate(new Date().toISOString())}
          />
        </div>
      </div>

      {/* ── Grade Tables ── */}
      <div className="p-4 space-y-6">
        {exams.length === 0 && (
          <p className="text-sm text-center text-gray-400 py-8">
            {t("reportCard.preview.noGrades")}
          </p>
        )}

        {exams.map((exam) => {
          const pctSubjects = exam.subjects.filter(
            (s) => s.grading_type === "PERCENTAGE"
          );
          const examTotalObtained = pctSubjects.reduce(
            (s, i) => s + parseFloat(i.grades_obtained),
            0
          );
          const examTotalMax = pctSubjects.reduce(
            (s, i) => s + (i.grading_extras?.max_value ?? 0),
            0
          );
          const examAvgPct = examTotalMax
            ? ((examTotalObtained / examTotalMax) * 100).toFixed(1)
            : null;
          const examAllPass = exam.subjects.every((s) =>
            isPassing(s.grades_obtained, s.grading_extras?.passing_value)
          );

          return (
            <div key={exam.exam_id}>
              {/* Exam header */}
              <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-gray-400">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                  {exam.exam_name}
                </h3>
                <div className="flex items-center gap-3">
                  {examAvgPct !== null && (
                    <span className="text-xs text-gray-500">
                      {t("reportCard.preview.examAverage")}:{" "}
                      <span className="font-bold text-gray-800">{examAvgPct}%</span>
                    </span>
                  )}
                  <ResultBadge pass={examAllPass} />
                </div>
              </div>

              {/* Grades table */}
              <table className="w-full text-sm border border-gray-300 border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 text-xs uppercase">
                    <Th left>{t("reportCard.preview.table.subject")}</Th>
                    <Th>{t("reportCard.preview.table.marksObtained")}</Th>
                    <Th>{t("reportCard.preview.table.maxMarks")}</Th>
                    <Th>{t("reportCard.preview.table.passingMarks")}</Th>
                    <Th>{t("reportCard.preview.table.percentage")}</Th>
                    <Th>{t("reportCard.preview.table.result")}</Th>
                    <Th left>{t("reportCard.preview.table.remarks")}</Th>
                  </tr>
                </thead>
                <tbody>
                  {exam.subjects.map((sub) => {
                    const pass = isPassing(
                      sub.grades_obtained,
                      sub.grading_extras?.passing_value
                    );
                    const pct =
                      sub.grading_type === "PERCENTAGE"
                        ? toPercent(
                            sub.grades_obtained,
                            sub.grading_extras?.max_value
                          )
                        : null;

                    return (
                      <tr key={sub.grade_id} className="border-t border-gray-200 odd:bg-white even:bg-gray-50">
                        <Td left bold>{sub.subject_name}</Td>
                        <Td mono>
                          {sub.grades_obtained}
                          {sub.grading_type === "GPA" ? " GPA" : ""}
                        </Td>
                        <Td>{sub.grading_extras?.max_value ?? "—"}</Td>
                        <Td>{sub.grading_extras?.passing_value ?? "—"}</Td>
                        <Td>{pct !== null ? `${pct}%` : "—"}</Td>
                        <Td>
                          <ResultBadge pass={pass} small />
                        </Td>
                        <Td left muted>{sub.remarks || "—"}</Td>
                      </tr>
                    );
                  })}

                  {/* Exam total row */}
                  {pctSubjects.length > 1 && (
                    <tr className="border-t-2 border-gray-400 bg-gray-100 font-semibold text-xs">
                      <Td left bold>{t("reportCard.preview.total")}</Td>
                      <Td bold mono>{examTotalObtained}</Td>
                      <Td bold>{examTotalMax}</Td>
                      <Td>—</Td>
                      <Td bold>{examAvgPct ? `${examAvgPct}%` : "—"}</Td>
                      <Td>
                        <ResultBadge pass={examAllPass} small />
                      </Td>
                      <Td left>—</Td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      {/* ── Signatures ── */}
      <div className="border-t border-gray-300 mx-4 mb-6 pt-6">
        <div className="grid grid-cols-3 gap-6 text-center text-xs text-gray-600">
          <SignatureLine label={t("reportCard.preview.signatures.classTeacher")} />
          <SignatureLine label={t("reportCard.preview.signatures.principal")} />
          <SignatureLine label={t("reportCard.preview.signatures.parent")} />
        </div>
      </div>
    </div>
  );
}

// ── Small primitives ──────────────────────────────────────────────────────

function InfoCell({ label, value, mono, bold, span }) {
  return (
    <div className={span ? "col-span-2 sm:col-span-2" : ""}>
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className={`text-sm text-gray-900 ${bold ? "font-bold" : "font-semibold"} ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}


function SignatureLine({ label }) {
  return (
    <div>
      <div className="border-b border-gray-400 mb-1 h-8" />
      <p className="font-medium text-gray-600">{label}</p>
    </div>
  );
}

function ResultBadge({ pass, small }) {
  const { t } = useTranslation();
  const base = small
    ? "text-xs font-bold px-2 py-0.5 rounded"
    : "text-xs font-semibold px-2.5 py-0.5 rounded";
  return (
    <span
      className={`inline-block ${base} ${
        pass
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-red-100 text-red-700 border border-red-200"
      }`}
    >
      {pass ? t("reportCard.preview.pass") : t("reportCard.preview.fail")}
    </span>
  );
}

function Th({ children, left }) {
  return (
    <th
      className={`px-3 py-2 border border-gray-300 font-semibold tracking-wide ${
        left ? "text-left" : "text-center"
      }`}
    >
      {children}
    </th>
  );
}

function Td({ children, left, bold, mono, muted }) {
  return (
    <td
      className={`px-3 py-2 border border-gray-200 ${left ? "text-left" : "text-center"} ${
        bold ? "font-semibold" : ""
      } ${mono ? "font-mono" : ""} ${muted ? "text-gray-400 text-xs" : "text-gray-700"}`}
    >
      {children}
    </td>
  );
}

// ── Main export ───────────────────────────────────────────────────────────

export default function ReportCardPreview({ reportCards, campusDetails, sectionMap }) {
  const { t } = useTranslation();

  function handlePrint() {
    window.print();
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="print:hidden flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
        <p className="text-sm text-gray-500">
          {t("reportCard.preview.cardCount", { count: reportCards.length })}
        </p>
        <Button size="sm" onClick={handlePrint}>
          {t("reportCard.preview.printSave")}
        </Button>
      </div>

      {reportCards.map((card) => (
        <SingleReportCard
          key={card.student.student_id}
          card={card}
          campusDetails={campusDetails}
          sectionName={sectionMap?.[card.student.student_id]}
        />
      ))}
    </div>
  );
}
