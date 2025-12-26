import { CLASS_TYPE, COURSE, CLASS_SHIFT } from "../utils/constants/globalConstants";

export const classSchema = [
  {
    section_title: "class.sections.classInformation",
    fields: [
      {
        id: "class_name",
        name: "class.fields.className",
        value: "",
        type: "text",
        mandatory: true,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
      {
        id: "class_short_name",
        name: "class.fields.shortName",
        value: "",
        type: "text",
        mandatory: false,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
      {
        id: "class_description",
        name: "class.fields.description",
        value: "",
        type: "text",
        mandatory: false,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      },
      {
        id: "class_room_no",
        name: "class.fields.roomNumber",
        value: "",
        type: "text",
        mandatory: false,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      },
      {
        id: "class_teacher_id",
        name: "class.fields.classTeacher",
        value: "",
        type: "dropdown",
        options: [],
        mandatory: false,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      }
    ]
  },

  {
    section_title: "class.sections.classSettings",
    fields: [
      {
        id: "class_has_sections",
        name: "class.fields.hasSections",
        value: true,
        type: "checkbox",
        mandatory: false,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      },
      {
        id: "class_max_students",
        name: "class.fields.maxStudents",
        value: "",
        type: "number",
        mandatory: false,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      }
    ]
  },

  {
    section_title: "class.sections.classCategorization",
    fields: [
      {
        id: "class_type",
        name: "class.fields.classType",
        value: "",
        type: "dropdown",
        options: CLASS_TYPE,
        mandatory: false,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
      {
        id: "class_stream",
        name: "class.fields.stream",
        value: "",
        type: "dropdown",
        options: COURSE,
        mandatory: false,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
      {
        id: "shift",
        name: "class.fields.shift",
        value: "",
        type: "dropdown",
        options: CLASS_SHIFT,
        mandatory: false,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      }
    ]
  }
];
