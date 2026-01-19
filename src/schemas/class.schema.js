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
      // {
      //   id: "class_room_no",
      //   name: "class.fields.roomNumber",
      //   value: "",
      //   type: "text",
      //   mandatory: false,
      //   width: { tablet: 6, desktop: 4, mobile: 12 }
      // },
      // {
      //   id: "class_teacher_id",
      //   name: "class.fields.classTeacher",
      //   value: "",
      //   type: "dropdown",
      //   options: [],
      //   mandatory: false,
      //   width: { tablet: 6, desktop: 4, mobile: 12 }
      // }
    ]
  },

  // {
  //   section_title: "class.sections.classSettings",
  //   fields: [
  //     {
  //       id: "class_has_sections",
  //       name: "class.fields.hasSections",
  //       value: true,
  //       type: "checkbox",
  //       mandatory: false,
  //       width: { tablet: 6, desktop: 4, mobile: 12 }
  //     },
  //     {
  //       id: "class_max_students",
  //       name: "class.fields.maxStudents",
  //       value: "",
  //       type: "number",
  //       mandatory: false,
  //       width: { tablet: 4, desktop: 4, mobile: 12 }
  //     }
  //   ]
  // },

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
        id: "class_subjects",
        name: "Subjects",
        placeholder: "Add Subjects",
        value: [],
        type: "dropdown",
        fn: (value, formData, setFormData) => {
          setFormData(prev => ({
            ...prev,
            class_subjects: value
          }));
        },
        onAdd: (opt, formData, setFormData) => {
          setFormData(prev => ({
            ...prev,
            class_subjects: [...prev.class_subjects, opt]
          }));
        },
        multiple: true,
        allowAdd: true,
        options: (formData) =>{

          const terms = formData?.class_subjects ?? [];
          return terms.map(term => ({
            value: term,
            label: term
          }));
        },
        mandatory: true,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
      {
        id: "class_exam_types",
        name: "Exam Types",
        placeholder: "Exam Types",
        value: [],
        type: "dropdown",
        fn: (value, formData, setFormData) => {
          setFormData(prev => ({
            ...prev,
            class_exam_types: value
          }));
        },
        onAdd: (opt, formData, setFormData) => {
          setFormData(prev => ({
            ...prev,
            class_exam_types: [...prev.class_exam_types, opt]
          }));
        },
        multiple: true,
        allowAdd: true,
        options: (formData) =>{

          const terms = formData?.class_exam_types ?? [];
          return terms.map(term => ({
            value: term,
            label: term
          }));
        },
        mandatory: true,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      }
      // {
      //   id: "class_stream",
      //   name: "class.fields.stream",
      //   value: "",
      //   type: "dropdown",
      //   options: COURSE,
      //   mandatory: false,
      //   width: { tablet: 4, desktop: 4, mobile: 12 }
      // },
      // {
      //   id: "shift",
      //   name: "class.fields.shift",
      //   value: "",
      //   type: "dropdown",
      //   options: CLASS_SHIFT,
      //   mandatory: false,
      //   width: { tablet: 4, desktop: 4, mobile: 12 }
      // }
    ]
  },

  {
    section_title: "Grading Configuration",
    fields: [
      {
        id: "class_grading_config",
        name: "Grading Configuration",
        value: {},
        type: "json",
        placeholder: "Enter grading configuration as JSON...",
        height: "h-80",
        mandatory: false,
        width: { tablet: 12, desktop: 12, mobile: 12 }
      }
    ]
  }
];
