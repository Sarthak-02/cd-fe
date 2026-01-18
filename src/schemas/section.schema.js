export const sectionSchema = [
  {
    section_title: "section.sections.sectionInformation",
    fields: [
      {
        id: "section_name",
        name: "section.fields.sectionName",
        value: "",
        type: "text",
        mandatory: true,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
      {
        id: "section_short_name",
        name: "section.fields.shortName",
        value: "",
        type: "text",
        mandatory: false,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
      {
        id: "class_id",
        name: "section.fields.class",
        value: "",
        type: "dropdown",
        options: [],
        mandatory: true,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      }
    ]
  },

  {
    section_title: "section.sections.capacityAllocation",
    fields: [
      {
        id: "section_teacher_id",
        name: "section.fields.classTeacher",
        value: "",
        type: "dropdown",
        options: [],
        mandatory: false,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      },
      // {
      //   id: "section_max_students",
      //   name: "section.fields.maxStudents",
      //   value: "",
      //   type: "number",
      //   mandatory: false,
      //   width: { tablet: 6, desktop: 4, mobile: 12 }
      // },
      {
        id: "section_room_no",
        name: "section.fields.roomNumber",
        value: "",
        type: "text",
        mandatory: false,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      },
      {
        id: "section_subjects",
        name: "Subjects",
        placeholder: "Add Subjects",
        value: [],
        type: "dropdown",
        fn: (value, formData, setFormData) => {
          setFormData(prev => ({
            ...prev,
            section_subjects: value
          }));
        },
        onAdd: (opt, formData, setFormData) => {
          setFormData(prev => ({
            ...prev,
            section_subjects: [...prev.section_subjects, opt]
          }));
        },
        multiple: true,
        allowAdd: true,
        options: (formData) =>{

          const terms = formData?.section_subjects ?? [];
          return terms.map(term => ({
            value: term,
            label: term
          }));
        },
        mandatory: true,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
    ]
  }
];
