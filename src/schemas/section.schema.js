export const sectionSchema = [
    {
      "section_title": "Section Information",
      "fields": [
        {
          "id": "section_name",
          "name": "Section Name",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "section_short_name",
          "name": "Short Name",
          "value": "",
          "type": "text",
          "mandatory": false,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
      ]
    },
  
    {
      "section_title": "Capacity & Allocation",
      "fields": [
        {
          "id": "section_teacher_id",
          "name": "Class Teacher",
          "value": "",
          "type": "dropdown",
          "options": [],
          "mandatory": false,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "max_students",
          "name": "Max Students Allowed",
          "value": "",
          "type": "number",
          "mandatory": false,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "section_room_no",
          "name": "Room Number",
          "value": "",
          "type": "text",
          "mandatory": false,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        }
      ]
    },
  
  ]
  