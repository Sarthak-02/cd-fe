export const studentSchema = [
    {
      "section_title": "Student Identification",
      "fields": [
        {
          "id": "student_admission_no",
          "name": "Admission Number",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "student_roll_no",
          "name": "Roll Number",
          "value": "",
          "type": "text",
          "mandatory": false,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        // {
        //   "id": "class_id",
        //   "name": "Class",
        //   "value": "",
        //   "type": "dropdown",
        //   "options": [],
        //   "mandatory": true,
        //   "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        // },
        // {
        //   "id": "section_id",
        //   "name": "Section",
        //   "value": "",
        //   "type": "dropdown",
        //   "options": [],
        //   "mandatory": true,
        //   "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        // },
        {
          "id": "student_photo_url",
          "name": "Student Photo",
          "value": "",
          "type": "file",
          "mandatory": false,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        }
      ]
    },
  
    {
      "section_title": "Personal Details",
      "fields": [
        {
          "id": "student_first_name",
          "name": "First Name",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "student_middle_name",
          "name": "Middle Name",
          "value": "",
          "type": "text",
          "mandatory": false,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "student_last_name",
          "name": "Last Name",
          "value": "",
          "type": "text",
          "mandatory": false,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "student_gender",
          "name": "Gender",
          "value": "",
          "type": "dropdown",
          "options": ["Male", "Female", "Other"],
          "mandatory": false,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "student_dob",
          "name": "Date of Birth",
          "value": "",
          "type": "date",
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "student_blood_group",
          "name": "Blood Group",
          "value": "",
          "type": "dropdown",
          "options": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
          "mandatory": false,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        }
      ]
    },
  
    {
      "section_title": "Academic Information",
      "fields": [
        {
          "id": "student_admission_date",
          "name": "Admission Date",
          "value": "",
          "type": "date",
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "student_house_name",
          "name": "House Name",
          "value": "",
          "type": "dropdown",
          "options": ["Red", "Blue", "Green", "Yellow"],
          "mandatory": false,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "student_category",
          "name": "Category",
          "value": "",
          "type": "dropdown",
          "options": ["General", "SC", "ST", "OBC", "EWS"],
          "mandatory": false,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "student_current_status",
          "name": "Status",
          "value": "active",
          "type": "dropdown",
          "options": ["active", "graduated", "withdrawn"],
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        }
      ]
    },
  
    {
      "section_title": "Student Contact Information",
      "fields": [
        {
          "id": "student_email",
          "name": "Student Email",
          "value": "",
          "type": "text",
          "mandatory": false,
          "width": { "tablet": 6, "desktop": 6, "mobile": 12 }
        },
        {
          "id": "student_phone",
          "name": "Student Phone",
          "value": "",
          "type": "text",
          "mandatory": false,
          "width": { "tablet": 6, "desktop": 6, "mobile": 12 }
        }
      ]
    },
  
    {
      "section_title": "Parent / Guardian Details",
      "fields": [
        {
          "id": "student_father_name",
          "name": "Father's Name",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "student_mother_name",
          "name": "Mother's Name",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "student_guardian_name",
          "name": "Guardian Name",
          "value": "",
          "type": "text",
          "mandatory": false,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "student_guardian_relation",
          "name": "Guardian Relation",
          "value": "",
          "type": "text",
          "mandatory": false,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "student_guardian_email",
          "name": "Guardian Email",
          "value": "",
          "type": "text",
          "mandatory": false,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "student_guardian_phone",
          "name": "Guardian Phone",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        }
      ]
    },
  
    {
      "section_title": "Guardian Address",
      "fields": [
        {
          "id": "student_guardian_address",
          "name": "Address",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 6, "desktop": 6, "mobile": 12 }
        },
        {
          "id": "student_guardian_city",
          "name": "City",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "student_guardian_state",
          "name": "State",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "student_guardian_country",
          "name": "Country",
          "value": "India",
          "type": "dropdown",
          "options": ["India"],
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "student_guardian_pincode",
          "name": "Pincode",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        }
      ]
    },
  
    {
      "section_title": "Emergency & Medical Information",
      "fields": [
        {
          "id": "student_emergency_contact_name",
          "name": "Emergency Contact Name",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "student_emergency_contact_phone",
          "name": "Emergency Contact Phone",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "student_medical_conditions",
          "name": "Medical Conditions",
          "value": "",
          "type": "textarea",
          "mandatory": false,
          "width": { "tablet": 12, "desktop": 12, "mobile": 12 }
        }
      ]
    },
  
    {
      "section_title": "Remarks & Additional Info",
      "fields": [
        {
          "id": "student_remarks",
          "name": "Remarks",
          "value": "",
          "type": "textarea",
          "mandatory": false,
          "width": { "tablet": 12, "desktop": 12, "mobile": 12 }
        }
      ]
    }
  ]
  