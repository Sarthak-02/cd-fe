export const teacherSchema = [
    {
        "section_title": "Personal Details",
        "fields": [
            { "id": "teacher_employee_code", "name": "Employee Code", "value": "", "type": "text", "mandatory": true, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_first_name", "name": "First Name", "value": "", "type": "text", "mandatory": true, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_middle_name", "name": "Middle Name", "value": "", "type": "text", "mandatory": false, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_last_name", "name": "Last Name", "value": "", "type": "text", "mandatory": false, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_gender", "name": "Gender", "value": "", "type": "dropdown", "options": ["Male", "Female", "Other"], "mandatory": false, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_dob", "name": "Date of Birth", "value": "", "type": "date", "mandatory": true, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_blood_group", "name": "Blood Group", "value": "", "type": "dropdown", "options": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], "mandatory": false, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_nationality", "name": "Nationality", "value": "Indian", "type": "text", "mandatory": false, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_religion", "name": "Religion", "value": "", "type": "text", "mandatory": false, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_marital_status", "name": "Marital Status", "value": "", "type": "dropdown", "options": ["Single", "Married", "Divorced", "Widowed"], "mandatory": false, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_photo_url", "name": "Teacher Photo", "value": "", "type": "file", "mandatory": false, "width": { "tablet": 6, "desktop": 4, "mobile": 12 } }
        ]
    },

    {
        "section_title": "Contact Information",
        "fields": [
            { "id": "teacher_email", "name": "Email", "value": "", "type": "text", "mandatory": true, "width": { "tablet": 6, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_phone", "name": "Phone Number", "value": "", "type": "text", "mandatory": true, "width": { "tablet": 6, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_address_line", "name": "Address Line", "value": "", "type": "text", "mandatory": true, "width": { "tablet": 6, "desktop": 6, "mobile": 12 } },
            { "id": "teacher_city", "name": "City", "value": "", "type": "text", "mandatory": true, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_state", "name": "State", "value": "", "type": "text", "mandatory": true, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_country", "name": "Country", "value": "India", "type": "dropdown", "options": ["India"], "mandatory": true, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_pincode", "name": "Pincode", "value": "", "type": "text", "mandatory": true, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } }
        ]
    },

    {
        "section_title": "Professional Details",
        "fields": [
            { "id": "teacher_qualification", "name": "Qualification", "value": "", "type": "text", "mandatory": false, "width": { "tablet": 6, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_experience_years", "name": "Experience (Years)", "value": "", "type": "number", "mandatory": false, "width": { "tablet": 3, "desktop": 3, "mobile": 12 } },
            { "id": "teacher_subjects", "name": "Subjects", "value": [], "type": "multiselect", "options": [], "mandatory": false, "width": { "tablet": 6, "desktop": 6, "mobile": 12 } },
            { "id": "teacher_designation", "name": "Designation", "value": "", "type": "dropdown", "options": ["PGT", "TGT", "PRT", "Principal", "HM", "Admin"], "mandatory": false, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_department", "name": "Department", "value": "", "type": "text", "mandatory": false, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_employment_type", "name": "Employment Type", "value": "", "type": "dropdown", "options": ["Permanent", "Contract", "Temporary"], "mandatory": false, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_doj", "name": "Date of Joining", "value": "", "type": "date", "mandatory": true, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_dol", "name": "Date of Leaving", "value": "", "type": "date", "mandatory": false, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } }
        ]
    },

    {
        "section_title": "System Access",
        "fields": [
            { "id": "teacher_user_id", "name": "Linked User", "value": "", "type": "dropdown", "options": [], "mandatory": false, "width": { "tablet": 6, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_role", "name": "Role", "value": "teacher", "type": "dropdown", "options": ["teacher", "admin", "coordinator"], "mandatory": true, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_status", "name": "Status", "value": "active", "type": "dropdown", "options": ["active", "inactive"], "mandatory": true, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } }
        ]
    },

    {
        "section_title": "Emergency Contact",
        "fields": [
            { "id": "teacher_emergency_contact_name", "name": "Emergency Contact Name", "value": "", "type": "text", "mandatory": true, "width": { "tablet": 6, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_emergency_contact_phone", "name": "Emergency Contact Phone", "value": "", "type": "text", "mandatory": true, "width": { "tablet": 6, "desktop": 4, "mobile": 12 } }
        ]
    },

    {
        "section_title": "Remarks & Additional Information",
        "fields": [
            { "id": "teacher_remarks", "name": "Remarks", "value": "", "type": "textarea", "mandatory": false, "width": { "tablet": 12, "desktop": 12, "mobile": 12 } }
        ]
    }
];
