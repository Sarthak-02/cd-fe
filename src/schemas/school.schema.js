import {
  EMAIL_OR_PHONE_REGEX,
  EMAIL_REGEX,
  SCHOOL_CATEGORIES,
  SCHOOL_TYPE
} from "../utils/constants/globalConstants";

export const schoolSchema = [
  {
    section_title: "school.sections.basicInformation",
    fields: [
      {
        id: "school_name",
        name: "school.fields.schoolName",
        value: "",
        type: "text",
        mandatory: true,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      },
      {
        id: "school_id",
        name: "school.fields.schoolId",
        value: "",
        type: "text",
        disabled: false,
        mandatory: true,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      },
      {
        id: "school_type",
        name: "school.fields.schoolType",
        value: "",
        type: "dropdown",
        options: SCHOOL_TYPE,
        mandatory: true,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      },
      {
        id: "school_motto",
        name: "school.fields.motto",
        value: "",
        type: "text",
        mandatory: false,
        width: { tablet: 6, desktop: 6, mobile: 12 }
      },
      {
        id: "school_website",
        name: "school.fields.website",
        value: "",
        type: "text",
        mandatory: false,
        width: { tablet: 6, desktop: 6, mobile: 12 }
      }
    ]
  },

  {
    section_title: "school.sections.administrationContacts",
    fields: [
      {
        id: "principal_name",
        name: "school.fields.principalName",
        value: "",
        type: "text",
        mandatory: true,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      },
      {
        id: "principal_email",
        name: "school.fields.principalEmail",
        regex: EMAIL_REGEX,
        value: "",
        type: "text",
        mandatory: true,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      },
      {
        id: "admin_contact",
        name: "school.fields.adminContact",
        regex: EMAIL_OR_PHONE_REGEX,
        value: "",
        type: "text",
        mandatory: true,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      }
    ]
  },

  {
    section_title: "school.sections.multiCampus",
    fields: [
      {
        id: "has_campus",
        name: "school.fields.hasCampus",
        value: false,
        type: "checkbox",
        mandatory: true,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      },
      {
        id: "default_campus",
        name: "school.fields.defaultCampus",
        value: "Main Campus",
        type: "text",
        mandatory: true,
        show_if: { has_campus: false },
        width: { tablet: 6, desktop: 4, mobile: 12 }
      }
    ]
  },

  {
    section_title: "school.sections.administrativeInformation",
    fields: [
      {
        id: "affiliation_number",
        name: "school.fields.affiliationNumber",
        value: "",
        type: "text",
        mandatory: false,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      },
      {
        id: "registration_number",
        name: "school.fields.registrationNumber",
        value: "",
        type: "text",
        mandatory: false,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      },
      {
        id: "founded_year",
        name: "school.fields.foundedYear",
        value: "",
        type: "text",
        mandatory: false,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
      {
        id: "school_category",
        name: "school.fields.schoolCategory",
        value: "",
        type: "dropdown",
        options: SCHOOL_CATEGORIES,
        mandatory: false,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      }
    ]
  }
];
