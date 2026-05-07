import {
  GENDER,
  BLOOD_GROUP,
  RESERVATION_CATEGORY,
  ADMISSION_STATUS,
  PHONE_REGEX,
} from "../utils/constants/globalConstants";
import { Country, State, City } from "country-state-city";

/** Keys accepted inside `extras` on create/update (matches backend admission API). */
export const ADMISSION_EXTRAS_KEYS = [
  "admission_blood_group",
  "admission_category",
  "admission_father_name",
  "admission_mother_name",
  "admission_guardian_phone",
  "admission_guardian_address",
  "admission_guardian_country",
  "admission_guardian_state",
  "admission_guardian_city",
  "admission_guardian_pincode",
  "admission_prev_school_name",
  "admission_prev_school_class",
  "admission_prev_school_percentage",
  "admission_remarks",
];

export function pickAdmissionExtras(form) {
  if (!form || typeof form !== "object") return null;
  const out = {};
  for (const key of ADMISSION_EXTRAS_KEYS) {
    const v = form[key];
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      out[key] = typeof v === "string" ? v : String(v);
    }
  }
  return Object.keys(out).length ? out : null;
}

export const admissionSchema = [
  // ---------------------
  // APPLICATION DETAILS
  // ---------------------
  {
    section_title: "admission.sections.applicationDetails",
    fields: [
      { id: "admission_application_no", name: "admission.fields.applicationNo", value: "", type: "text", mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "admission_academic_year", name: "admission.fields.academicYear", value: "", type: "text", mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "admission_date", name: "admission.fields.applicationDate", value: "", type: "date", mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "admission_applied_class_id", name: "admission.fields.appliedClass", value: "", type: "dropdown", options: [], mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "admission_status", name: "admission.fields.status", value: "pending", type: "dropdown", options: ADMISSION_STATUS, mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },
    ],
  },

  // ---------------------
  // PERSONAL DETAILS
  // ---------------------
  {
    section_title: "admission.sections.personalDetails",
    fields: [
      { id: "admission_first_name", name: "admission.fields.firstName", value: "", type: "text", mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "admission_middle_name", name: "admission.fields.middleName", value: "", type: "text", mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "admission_last_name", name: "admission.fields.lastName", value: "", type: "text", mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },

      { id: "admission_gender", name: "admission.fields.gender", value: "", type: "dropdown", options: GENDER, mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "admission_dob", name: "admission.fields.dateOfBirth", value: "", type: "date", mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "admission_blood_group", name: "admission.fields.bloodGroup", value: "", type: "dropdown", options: BLOOD_GROUP, mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "admission_category", name: "admission.fields.category", value: "", type: "dropdown", options: RESERVATION_CATEGORY, mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },
    ],
  },

  // ---------------------
  // PARENT / GUARDIAN
  // ---------------------
  {
    section_title: "admission.sections.guardianDetails",
    fields: [
      { id: "admission_father_name", name: "admission.fields.fatherName", value: "", type: "text", mandatory: false, width: { tablet: 6, desktop: 4, mobile: 12 } },
      { id: "admission_mother_name", name: "admission.fields.motherName", value: "", type: "text", mandatory: false, width: { tablet: 6, desktop: 4, mobile: 12 } },

      { id: "admission_guardian_phone", name: "admission.fields.guardianPhone", value: "", regex: PHONE_REGEX, type: "text", mandatory: false, width: { tablet: 6, desktop: 4, mobile: 12 } },

      { id: "admission_guardian_address", name: "admission.fields.address", value: "", type: "text", mandatory: false, width: { tablet: 12, desktop: 12, mobile: 12 } },

      {
        id: "admission_guardian_country",
        name: "admission.fields.country",
        value: "IN",
        type: "dropdown",
        mandatory: false,
        options: Country.getAllCountries().map(c => ({ label: `${c.name} (${c.isoCode})`, value: c.isoCode })),
        width: { tablet: 4, desktop: 4, mobile: 12 },
      },

      {
        id: "admission_guardian_state",
        name: "admission.fields.state",
        value: "",
        type: "dropdown",
        mandatory: false,
        options: form => {
          const states = State.getStatesOfCountry(form.admission_guardian_country);
          return states.map(s => ({ label: `${s.name} (${s.isoCode})`, value: s.isoCode }));
        },
        width: { tablet: 4, desktop: 4, mobile: 12 },
      },

      {
        id: "admission_guardian_city",
        name: "admission.fields.city",
        value: "",
        type: "dropdown",
        mandatory: false,
        options: form => {
          const { admission_guardian_country, admission_guardian_state } = form;
          return City.getCitiesOfState(admission_guardian_country, admission_guardian_state)
            .map(city => ({ label: city.name, value: city.name }));
        },
        width: { tablet: 4, desktop: 4, mobile: 12 },
      },

      { id: "admission_guardian_pincode", name: "admission.fields.pincode", value: "", type: "text", mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },
    ],
  },

  // ---------------------
  // PREVIOUS SCHOOL
  // ---------------------
  {
    section_title: "admission.sections.previousSchool",
    fields: [
      { id: "admission_prev_school_name", name: "admission.fields.previousSchoolName", value: "", type: "text", mandatory: false, width: { tablet: 6, desktop: 6, mobile: 12 } },
      { id: "admission_prev_school_class", name: "admission.fields.previousClass", value: "", type: "text", mandatory: false, width: { tablet: 6, desktop: 6, mobile: 12 } },
      { id: "admission_prev_school_percentage", name: "admission.fields.previousPercentage", value: "", type: "text", mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },
    ],
  },

  // ---------------------
  // REMARKS
  // ---------------------
  {
    section_title: "admission.sections.remarks",
    fields: [
      { id: "admission_remarks", name: "admission.fields.remarks", value: "", type: "textarea", mandatory: false, markdown: true, width: { tablet: 12, desktop: 12, mobile: 12 } },
    ],
  },
];
