export const PRICE_TIERS = [
  { value: "basic", label: "Basic" },
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
  { value: "enterprise", label: "Enterprise" },
];

export const STUDENT_FEATURES = [
  { id: "student_attendance_view", label: "Attendance (view)", classSpecific: false },
  { id: "student_homework", label: "Homework (view & submit)", classSpecific: false },
  { id: "student_lesson_plans", label: "Lesson Plans (view)", classSpecific: false },
  { id: "student_announcements", label: "Announcements (view)", classSpecific: false },
  { id: "student_exams", label: "Exams (view schedule & details)", classSpecific: false },
  { id: "student_messages", label: "Messages / Chat", classSpecific: false },
  { id: "student_pickup", label: "Pickup (view pickup status)", classSpecific: true },
  { id: "student_reporting", label: "Reporting (academic performance)", classSpecific: false },
  { id: "student_study_ai", label: "Study / AI Study Companion", classSpecific: false },
  { id: "student_scholarships", label: "Scholarships (browse)", classSpecific: false },
];

export const STAFF_FEATURES = [
  { id: "staff_attendance_mark", label: "Attendance (mark sections)", classSpecific: false },
  { id: "staff_homework", label: "Homework (assign & manage)", classSpecific: false },
  { id: "staff_lesson_plans", label: "Lesson Plans (create & manage)", classSpecific: false },
  { id: "staff_exams", label: "Exams (create, manage, enter marks)", classSpecific: false },
  { id: "staff_messages", label: "Messages / Chat", classSpecific: false },
  { id: "staff_pickup", label: "Pickup (manage student pickup)", classSpecific: true },
  { id: "staff_reporting", label: "Reporting (section & class level analytics)", classSpecific: false },
  { id: "staff_broadcast", label: "Broadcast Notifications", classSpecific: false },
  { id: "staff_scholarships", label: "Scholarships (browse)", classSpecific: false },
  { id: "staff_study_ai", label: "Study / AI Study Companion", classSpecific: false },
];

function buildTierFeatures(features, enabledIds) {
  const result = {};
  features.forEach((f) => {
    result[f.id] = {
      enabled: enabledIds.includes(f.id),
      classes: f.classSpecific ? ["primary"] : [],
    };
  });
  return result;
}

const BASIC_STUDENT = ["student_attendance_view", "student_homework", "student_announcements"];
const BASIC_STAFF = ["staff_attendance_mark", "staff_homework"];

const STANDARD_STUDENT = [
  "student_attendance_view", "student_homework", "student_lesson_plans",
  "student_announcements", "student_exams", "student_messages",
];
const STANDARD_STAFF = [
  "staff_attendance_mark", "staff_homework", "staff_lesson_plans",
  "staff_exams", "staff_messages", "staff_reporting",
];

const PREMIUM_STUDENT = [
  "student_attendance_view", "student_homework", "student_lesson_plans",
  "student_announcements", "student_exams", "student_messages",
  "student_pickup", "student_reporting", "student_scholarships",
];
const PREMIUM_STAFF = [
  "staff_attendance_mark", "staff_homework", "staff_lesson_plans",
  "staff_exams", "staff_messages", "staff_pickup",
  "staff_reporting", "staff_broadcast", "staff_scholarships",
];

export const DEFAULT_TIER_CONFIG = {
  basic: {
    ...buildTierFeatures(STUDENT_FEATURES, BASIC_STUDENT),
    ...buildTierFeatures(STAFF_FEATURES, BASIC_STAFF),
  },
  standard: {
    ...buildTierFeatures(STUDENT_FEATURES, STANDARD_STUDENT),
    ...buildTierFeatures(STAFF_FEATURES, STANDARD_STAFF),
  },
  premium: {
    ...buildTierFeatures(STUDENT_FEATURES, PREMIUM_STUDENT),
    ...buildTierFeatures(STAFF_FEATURES, PREMIUM_STAFF),
  },
  enterprise: {
    ...buildTierFeatures(STUDENT_FEATURES, STUDENT_FEATURES.map((f) => f.id)),
    ...buildTierFeatures(STAFF_FEATURES, STAFF_FEATURES.map((f) => f.id)),
  },
};
