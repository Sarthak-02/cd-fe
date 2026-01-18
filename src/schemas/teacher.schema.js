import { generateImageSignedUrl } from "../api/upload.api";
import {
  EMPLOYMNENT_TYPE,
  GENDER,
  BLOOD_GROUP,
  MARITAL_STATUS,
  ROLES,
  STATUS,
  TEACHER_DESIGNATION,
  EMAIL_REGEX,
  PHONE_REGEX
} from "../utils/constants/globalConstants";
import { Country, State, City } from "country-state-city";

export const teacherSchema = [
  {
    section_title: "teacher.sections.personalDetails",
    fields: [
      { id: "teacher_employee_code", name: "teacher.fields.employeeCode", value: "", type: "text", mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "teacher_first_name", name: "teacher.fields.firstName", value: "", type: "text", mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "teacher_middle_name", name: "teacher.fields.middleName", value: "", type: "text", mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "teacher_last_name", name: "teacher.fields.lastName", value: "", type: "text", mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "teacher_gender", name: "teacher.fields.gender", value: "", type: "dropdown", options: GENDER, mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "teacher_dob", name: "teacher.fields.dateOfBirth", value: "", type: "date", mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "teacher_blood_group", name: "teacher.fields.bloodGroup", value: "", type: "dropdown", options: BLOOD_GROUP, mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "teacher_nationality", name: "teacher.fields.nationality", value: "Indian", type: "text", mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "teacher_religion", name: "teacher.fields.religion", value: "", type: "text", mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "teacher_marital_status", name: "teacher.fields.maritalStatus", value: "", type: "dropdown", options: MARITAL_STATUS, mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },

      {
        id: "teacher_photo_url",
        name: "teacher.fields.teacherPhoto",
        value: "",
        type: "image",
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
            setState(prev => ({ ...prev, teacher_photo_url: "" }));
            return;
          }

          const payload = {
            file,
            entity: "teacher",
            mimeType: file.type,
            fileSize: file.size,
            entityId: state?.teacher_employee_code
          };

          const { original } = await generateImageSignedUrl(payload);
          setState(prev => ({ ...prev, teacher_photo_url: original }));
        },
        mandatory: false,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      }
    ]
  },

  {
    section_title: "teacher.sections.contactInformation",
    fields: [
      { id: "teacher_email", name: "teacher.fields.email", regex: EMAIL_REGEX, value: "", type: "text", mandatory: true, width: { tablet: 6, desktop: 4, mobile: 12 } },
      { id: "teacher_phone", name: "teacher.fields.phone", regex: PHONE_REGEX, value: "", type: "text", mandatory: true, width: { tablet: 6, desktop: 4, mobile: 12 } },
      { id: "teacher_address_line", name: "teacher.fields.address", value: "", type: "text", mandatory: true, width: { tablet: 6, desktop: 6, mobile: 12 } },

      {
        id: "teacher_city",
        name: "teacher.fields.city",
        value: "",
        type: "dropdown",
        mandatory: true,
        options: form =>
          City.getCitiesOfState(form.teacher_country, form.teacher_state)
            .map(city => ({ ...city, label: city.name, value: city.name })),
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
      {
        id: "teacher_state",
        name: "teacher.fields.state",
        value: "",
        type: "dropdown",
        mandatory: true,
        options: form =>
          State.getStatesOfCountry(form.teacher_country)
            .map(s => ({ ...s, label: `${s.name} (${s.isoCode})`, value: s.isoCode })),
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
      {
        id: "teacher_country",
        name: "teacher.fields.country",
        value: "India",
        type: "dropdown",
        options: Country.getAllCountries().map(c => ({
          ...c,
          label: `${c.name} (${c.isoCode})`,
          value: c.isoCode
        })),
        mandatory: true,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
      { id: "teacher_pincode", name: "teacher.fields.pincode", value: "", type: "text", mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } }
    ]
  },

  {
    section_title: "teacher.sections.professionalDetails",
    fields: [
      { id: "teacher_qualification", name: "teacher.fields.qualification", value: "", type: "text", mandatory: false, width: { tablet: 6, desktop: 4, mobile: 12 } },
      { id: "teacher_experience_years", name: "teacher.fields.experienceYears", value: "", type: "number", mandatory: false, width: { tablet: 3, desktop: 3, mobile: 12 } },
      { id: "teacher_subjects", name: "teacher.fields.subjects", value: [], type: "multiselect", options: [], mandatory: false, width: { tablet: 6, desktop: 6, mobile: 12 } },
      { id: "teacher_designation", name: "teacher.fields.designation", value: "", type: "dropdown", options: [], mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "teacher_employment_type", name: "teacher.fields.employmentType", value: "", type: "dropdown", options: EMPLOYMNENT_TYPE, mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "teacher_doj", name: "teacher.fields.dateOfJoining", value: "", type: "date", mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "teacher_dol", name: "teacher.fields.dateOfLeaving", value: "", type: "date", mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } }
    ]
  },

  {
    section_title: "teacher.sections.systemAccess",
    fields: [
      { id: "teacher_role", name: "teacher.fields.role", value: "", type: "dropdown", options: [], mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "teacher_status", name: "teacher.fields.status", value: "", type: "dropdown", options: STATUS, mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } }
    ]
  },

  {
    section_title: "teacher.sections.emergencyContact",
    fields: [
      { id: "teacher_emergency_contact_name", name: "teacher.fields.emergencyContactName", value: "", type: "text", mandatory: true, width: { tablet: 6, desktop: 4, mobile: 12 } },
      { id: "teacher_emergency_contact_phone", name: "teacher.fields.emergencyContactPhone", regex: PHONE_REGEX, value: "", type: "text", mandatory: true, width: { tablet: 6, desktop: 4, mobile: 12 } }
    ]
  },

  {
    section_title: "teacher.sections.remarks",
    fields: [
      { id: "teacher_remarks", name: "teacher.fields.remarks", value: "", type: "textarea", mandatory: false, width: { tablet: 12, desktop: 12, mobile: 12 } }
    ]
  }
];
