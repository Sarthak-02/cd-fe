import { CLASS_TYPE,COURSE,CLASS_SHIFT } from "../utils/constants/globalConstants"

export const classSchema = [
    {
      "section_title": "Class Information",
      "fields": [
        {
          "id": "class_name",
          "name": "Class Name",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "class_short_name",
          "name": "Short Name",
          "value": "",
          "type": "text",
          "mandatory": false,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "class_description",
          "name": "Description",
          "value": "",
          "type": "text",
          "mandatory": false,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        {
            "id": "class_room_no",
            "name": "Room Number",
            "value": "",
            "type": "text",
            "mandatory": false,
            "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        {
            "id": "class_teacher_id",
            "name": "Class Teacher",
            "value": "",
            "type": "dropdown",
            "options": [],
            "mandatory": false,
            "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
          },
      ]
    },
  
    {
      "section_title": "Class Settings",
      "fields": [
        {
          "id": "class_has_sections",
          "name": "Has Sections",
          "value": true,
          "type": "checkbox",
          "mandatory": false,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "class_max_students",
          "name": "Maximum Students Allowed",
          "value": "",
          "type": "number",
          "mandatory": false,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        }
      ]
    },
  
    {
      "section_title": "Class Categorization",
      "fields": [
        {
          "id": "class_type",
          "name": "Class Type",
          "value": "",
          "type": "dropdown",
          "options": CLASS_TYPE,
          "mandatory": false,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "class_stream",
          "name": "Stream",
          "value": "",
          "type": "dropdown",
          "options": COURSE,
          "mandatory": false,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "shift",
          "name": "Shift",
          "value": "",
          "type": "dropdown",
          "options":CLASS_SHIFT ,
          "mandatory": false,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        }
      ]
    },

  ]
  