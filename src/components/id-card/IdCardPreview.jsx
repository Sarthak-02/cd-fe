import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useTranslation } from "react-i18next";
import Button from "../../ui-components/Button";

const AVATAR_COLORS = [
  ["#DBEAFE", "#1D4ED8"],
  ["#EDE9FE", "#6D28D9"],
  ["#D1FAE5", "#065F46"],
  ["#FFEDD5", "#C2410C"],
  ["#FCE7F3", "#9D174D"],
  ["#CCFBF1", "#0F766E"],
  ["#FFE4E6", "#BE123C"],
  ["#E0E7FF", "#3730A3"],
];

function avatarPalette(name) {
  return AVATAR_COLORS[(name || "").charCodeAt(0) % AVATAR_COLORS.length];
}

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function buildQrPayload(student, campusDetails, sectionName) {
  const name = `${student.student_first_name ?? ""} ${student.student_last_name ?? ""}`.trim();
  const lines = [
    `Name: ${name}`,
    `Admission No: ${student.student_admission_no ?? ""}`,
    student.student_roll_no ? `Roll No: ${student.student_roll_no}` : null,
    sectionName ? `Class/Section: ${sectionName}` : null,
    student.student_dob ? `DOB: ${formatDate(student.student_dob)}` : null,
    student.student_blood_group ? `Blood Group: ${student.student_blood_group}` : null,
    student.student_father_name ? `Father: ${student.student_father_name}` : null,
    campusDetails?.campus_name ? `Campus: ${campusDetails.campus_name}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}

function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-1 leading-tight">
      <span className="text-[8px] text-gray-500 shrink-0 w-[52px]">{label}:</span>
      <span className="text-[9px] font-medium text-gray-800 break-words leading-tight">{value}</span>
    </div>
  );
}

function SingleIdCard({ student, campusDetails, sectionName }) {
  const name = `${student.student_first_name ?? ""} ${student.student_last_name ?? ""}`.trim();
  const initials = [student.student_first_name?.[0], student.student_last_name?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  const [bgColor, textColor] = avatarPalette(student.student_first_name);
  const qrValue = buildQrPayload(student, campusDetails, sectionName);

  const address = [campusDetails?.address_line, campusDetails?.city, campusDetails?.state]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className="id-card relative bg-white overflow-hidden print:break-inside-avoid"
      style={{
        width: "85.6mm",
        height: "54mm",
        border: "1px solid #CBD5E1",
        borderRadius: "6px",
        fontFamily: "sans-serif",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          height: "10mm",
          background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 4mm",
          gap: "3mm",
        }}
      >
        {/* School icon */}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "white", fontSize: "6.5px", fontWeight: "700", letterSpacing: "0.05em", lineHeight: 1.2, textTransform: "uppercase" }}>
            {campusDetails?.campus_name || "School Name"}
          </div>
          {address && (
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "5px", lineHeight: 1.2 }}>
              {address}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          display: "flex",
          padding: "2.5mm 3mm",
          gap: "3mm",
          height: "calc(54mm - 10mm - 7mm)",
        }}
      >
        {/* Left: photo + type badge */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2mm", flexShrink: 0 }}>
          <div
            style={{
              width: "18mm",
              height: "20mm",
              borderRadius: "3px",
              overflow: "hidden",
              border: "1.5px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: bgColor,
            }}
          >
            {student.student_photo_url ? (
              <img
                src={student.student_photo_url}
                alt={name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span style={{ fontSize: "11px", fontWeight: "700", color: textColor }}>
                {initials || "?"}
              </span>
            )}
          </div>
          <div
            style={{
              background: "#EFF6FF",
              color: "#1D4ED8",
              fontSize: "5.5px",
              fontWeight: "600",
              padding: "1px 4px",
              borderRadius: "2px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
            }}
          >
            Student ID
          </div>
        </div>

        {/* Center: student details */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5mm", paddingTop: "0.5mm", minWidth: 0 }}>
          <div>
            <div style={{ fontSize: "10px", fontWeight: "700", color: "#1E293B", lineHeight: 1.2 }}>
              {name}
            </div>
            {student.student_gender && (
              <div style={{ fontSize: "7px", color: "#64748B", lineHeight: 1.2 }}>
                {student.student_gender}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1mm" }}>
            <DetailRow label="Adm No" value={student.student_admission_no} />
            <DetailRow label="Roll No" value={student.student_roll_no} />
            <DetailRow label="Section" value={sectionName} />
            <DetailRow label="DOB" value={formatDate(student.student_dob)} />
            <DetailRow label="Blood" value={student.student_blood_group} />
            <DetailRow label="Father" value={student.student_father_name} />
          </div>
        </div>

        {/* Right: QR code */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1mm",
            flexShrink: 0,
          }}
        >
          <QRCodeSVG
            value={qrValue}
            size={48}
            level="M"
            bgColor="#ffffff"
            fgColor="#1E293B"
            style={{ display: "block" }}
          />
          <div style={{ fontSize: "5px", color: "#94A3B8", textAlign: "center" }}>
            Scan for details
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "7mm",
          background: "#F8FAFC",
          borderTop: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 3mm",
        }}
      >
        {campusDetails?.campus_contact_no && (
          <span style={{ fontSize: "6px", color: "#64748B" }}>
            Ph: {campusDetails.campus_contact_no}
          </span>
        )}
        {campusDetails?.campus_email && (
          <span style={{ fontSize: "6px", color: "#64748B" }}>
            {campusDetails.campus_email}
          </span>
        )}
        {campusDetails?.campus_website && (
          <span style={{ fontSize: "6px", color: "#3B82F6" }}>
            {campusDetails.campus_website}
          </span>
        )}
      </div>
    </div>
  );
}

export default function IdCardPreview({ students, campusDetails, sectionMap }) {
  const { t } = useTranslation();
  const printRef = useRef(null);

  function handlePrint() {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student ID Cards</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background: white; font-family: sans-serif; }
            .print-grid {
              display: grid;
              grid-template-columns: repeat(2, 85.6mm);
              gap: 6mm;
              padding: 10mm;
            }
            @media print {
              body { margin: 0; }
              .print-grid { gap: 5mm; padding: 8mm; }
              .id-card { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="print-grid">
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-gray-500">
          {t("idCard.preview.cardCount", { count: students.length })}
        </p>
        <Button onClick={handlePrint}>
          {t("idCard.preview.printSave")}
        </Button>
      </div>

      {/* Cards grid — screen preview */}
      <div
        ref={printRef}
        className="flex flex-wrap gap-6 justify-start"
        style={{ padding: "4px" }}
      >
        {students.map((student) => (
          <SingleIdCard
            key={student.student_id}
            student={student}
            campusDetails={campusDetails}
            sectionName={sectionMap?.[student.student_section_id] ?? null}
          />
        ))}
      </div>
    </div>
  );
}
