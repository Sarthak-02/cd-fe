import { generateImageSignedUrl } from "../api/upload.api";
import {
  GENDER,
  BLOOD_GROUP,
  RESERVATION_CATEGORY,
  STATUS,
  EMAIL_REGEX,
  PHONE_REGEX
} from "../utils/constants/globalConstants";
import { Country, State, City } from "country-state-city";

export const studentSchema = [
  // ---------------------
  // PERSONAL DETAILS
  // ---------------------
  {
    section_title: "student.sections.personalDetails",
    fields: [
      { id: "student_admission_no", name: "student.fields.admissionNumber", value: "", type: "text", mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "student_roll_no", name: "student.fields.rollNumber", value: "", type: "text", mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },

      { id: "student_first_name", name: "student.fields.firstName", value: "", type: "text", mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "student_middle_name", name: "student.fields.middleName", value: "", type: "text", mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "student_last_name", name: "student.fields.lastName", value: "", type: "text", mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },

      { id: "student_gender", name: "student.fields.gender", value: "", type: "dropdown", options: GENDER, mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "student_dob", name: "student.fields.dateOfBirth", value: "", type: "date", mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "student_blood_group", name: "student.fields.bloodGroup", value: "", type: "dropdown", options: BLOOD_GROUP, mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },

      {
        id: "student_photo_url",
        name: "student.fields.studentPhoto",
        value: "",
        type: "image",
        mandatory: false,
        accept: ["image/jpeg", "image/png", "image/webp"],
        maxSize: 2,
        config: {
          minWidth: 300,
          minHeight: 300,
          maxWidth: 2000,
          maxHeight: 2000
        },
        maxFiles: 1,
        fn: async (file, state, setState) => {
          if (!file) {
            setState(prev => ({ ...prev, student_photo_url: "" }));
            return;
          }

          const payload = {
            file,
            entity: "student",
            mimeType: file.type,
            fileSize: file.size,
            entityId: state?.teacher_employee_code
          };

          const { original } = await generateImageSignedUrl(payload);
          setState(prev => ({ ...prev, teacher_photo_url: original }));
        },
        width: { tablet: 6, desktop: 4, mobile: 12 }
      }
    ]
  },

  // ---------------------
  // ACADEMIC DETAILS
  // ---------------------
  {
    section_title: "student.sections.academicInformation",
    fields: [
      { id: "student_admission_date", name: "student.fields.admissionDate", value: "", type: "date", mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },

      { id: "class_id", name: "student.fields.class", value: "", type: "dropdown", mandatory: true, options: [], width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "section_id", name: "student.fields.section", value: "", type: "dropdown", mandatory: true, options: [], width: { tablet: 4, desktop: 4, mobile: 12 } },

      { id: "student_house_name", name: "student.fields.houseName", value: "", type: "dropdown", options: [], mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "student_category", name: "student.fields.category", value: "", type: "dropdown", options: RESERVATION_CATEGORY, mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },

      { id: "student_current_status", name: "student.fields.status", value: "", type: "dropdown", options: STATUS, mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } }
    ]
  },

  // ---------------------
  // STUDENT CONTACT
  // ---------------------
  {
    section_title: "student.sections.studentContact",
    fields: [
      { id: "student_email", name: "student.fields.studentEmail", value: "", regex: EMAIL_REGEX, type: "text", mandatory: false, width: { tablet: 6, desktop: 6, mobile: 12 } },
      { id: "student_phone", name: "student.fields.studentPhone", value: "", regex: PHONE_REGEX, type: "text", mandatory: false, width: { tablet: 6, desktop: 6, mobile: 12 } }
    ]
  },

  // ---------------------
  // PARENT / GUARDIAN
  // ---------------------
  {
    section_title: "student.sections.guardianDetails",
    fields: [
      { id: "student_father_name", name: "student.fields.fatherName", value: "", type: "text", mandatory: true, width: { tablet: 6, desktop: 4, mobile: 12 } },
      { id: "student_mother_name", name: "student.fields.motherName", value: "", type: "text", mandatory: true, width: { tablet: 6, desktop: 4, mobile: 12 } },

      { id: "student_guardian_name", name: "student.fields.guardianName", value: "", type: "text", mandatory: false, width: { tablet: 6, desktop: 4, mobile: 12 } },
      { id: "student_guardian_relation", name: "student.fields.guardianRelation", value: "", type: "text", mandatory: false, width: { tablet: 6, desktop: 4, mobile: 12 } },

      { id: "student_guardian_email", name: "student.fields.guardianEmail", regex: EMAIL_REGEX, value: "", type: "text", mandatory: false, width: { tablet: 6, desktop: 4, mobile: 12 } },
      { id: "student_guardian_phone", name: "student.fields.guardianPhone", regex: PHONE_REGEX, value: "", type: "text", mandatory: true, width: { tablet: 6, desktop: 4, mobile: 12 } }
    ]
  },

  // ---------------------
  // GUARDIAN ADDRESS
  // ---------------------
  {
    section_title: "student.sections.guardianAddress",
    fields: [
      { id: "student_guardian_address", name: "student.fields.address", value: "", type: "text", mandatory: true, width: { tablet: 6, desktop: 6, mobile: 12 } },

      {
        id: "student_guardian_city",
        name: "student.fields.city",
        value: "",
        type: "dropdown",
        mandatory: true,
        options: form => {
          const { student_guardian_country, student_guardian_state } = form;
          return City.getCitiesOfState(student_guardian_country, student_guardian_state)
            .map(city => ({ label: city.name, value: city.name }));
        },
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },

      {
        id: "student_guardian_state",
        name: "student.fields.state",
        value: "",
        type: "dropdown",
        mandatory: true,
        options: form => {
          const states = State.getStatesOfCountry(form.student_guardian_country);
          return states.map(s => ({ label: `${s.name} (${s.isoCode})`, value: s.isoCode }));
        },
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },

      {
        id: "student_guardian_country",
        name: "student.fields.country",
        value: "IN",
        type: "dropdown",
        mandatory: true,
        options: Country.getAllCountries().map(c => ({ label: `${c.name} (${c.isoCode})`, value: c.isoCode })),
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },

      { id: "student_guardian_pincode", name: "student.fields.pincode", value: "", type: "text", mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } }
    ]
  },

  // ---------------------
  // EMERGENCY + MEDICAL
  // ---------------------
  {
    section_title: "student.sections.emergencyMedical",
    fields: [
      { id: "student_emergency_contact_name", name: "student.fields.emergencyContactName", value: "", type: "text", mandatory: true, width: { tablet: 6, desktop: 4, mobile: 12 } },
      { id: "student_emergency_contact_phone", name: "student.fields.emergencyContactPhone", regex: PHONE_REGEX, value: "", type: "text", mandatory: true, width: { tablet: 6, desktop: 4, mobile: 12 } },
      { id: "student_medical_conditions", name: "student.fields.medicalConditions", value: "", type: "textarea", mandatory: false, width: { tablet: 12, desktop: 12, mobile: 12 } }
    ]
  },

  // ---------------------
  // REMARKS
  // ---------------------
  {
    section_title: "student.sections.remarks",
    fields: [
      { id: "student_remarks", name: "student.fields.remarks", value: "", type: "textarea", mandatory: false, markdown: true, width: { tablet: 12, desktop: 12, mobile: 12 } }
    ]
  }
];
