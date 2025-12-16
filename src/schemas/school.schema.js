import { EMAIL_OR_PHONE_REGEX, EMAIL_REGEX, SCHOOL_CATEGORIES, SCHOOL_TYPE } from "../utils/constants/globalConstants";

export const schoolSchema = [
    {
      "section_title": "Basic School Information",
      "fields": [
        {
          "id": "school_name",
          "name": "School Name",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "school_id",
          "name": "School Code / ID",
          "value": "",
          "type": "text",
          "disabled":false,
          "mandatory": true,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "school_type",
          "name": "School Type",
          "value": "",
          "type": "dropdown",
          "options": SCHOOL_TYPE,
          "mandatory": true,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
      
        {
          "id": "school_motto",
          "name": "Motto / Tagline",
          "value": "",
          "type": "text",
          "mandatory": false,
          "width": { "tablet": 6, "desktop": 6, "mobile": 12 }
        },
        // {
        //   "id": "logo",
        //   "name": "Logo / Branding Image",
        //   "value": "",
        //   "type": "file",
        //   "mandatory": false,
        //   "width": { "tablet": 6, "desktop": 6, "mobile": 12 }
        // },
        {
          "id": "school_website",
          "name": "Website URL",
          "value": "",
          "type": "text",
          "mandatory": false,
          "width": { "tablet": 6, "desktop": 6, "mobile": 12 }
        }
      ]
    },
  
    // {
    //   "section_title": "Contact & Address Details",
    //   "fields": [
    //     {
    //       "id": "address_line",
    //       "name": "Address",
    //       "value": "",
    //       "type": "text",
    //       "mandatory": true,
    //       "width": { "tablet": 12, "desktop": 12, "mobile": 12 }
    //     },
    //     // {
    //     //   "id": "address_line_2",
    //     //   "name": "Address Line 2",
    //     //   "value": "",
    //     //   "type": "text",
    //     //   "mandatory": false,
    //     //   "width": { "tablet": 6, "desktop": 6, "mobile": 12 }
    //     // },
    //     {
    //       "id": "city",
    //       "name": "City",
    //       "value": "",
    //       "type": "text",
    //       "mandatory": true,
    //       "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
    //     },
    //     {
    //       "id": "state",
    //       "name": "State / Province",
    //       "value": "",
    //       "type": "text",
    //       "mandatory": true,
    //       "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
    //     },
    //     {
    //       "id": "country",
    //       "name": "Country",
    //       "value": "India",
    //       "type": "dropdown",
    //       "options": ["India"],
    //       "mandatory": true,
    //       "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
    //     },
    //     {
    //       "id": "pincode",
    //       "name": "Pincode / ZIP Code",
    //       "value": "",
    //       "type": "text",
    //       "mandatory": true,
    //       "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
    //     },
    //     {
    //       "id": "email",
    //       "name": "Email",
    //       "value": "",
    //       "type": "text",
    //       "mandatory": true,
    //       "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
    //     },
    //     {
    //       "id": "phone_landline",
    //       "name": "Phone (Landline)",
    //       "value": "",
    //       "type": "text",
    //       "mandatory": false,
    //       "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
    //     },
    //     {
    //       "id": "mobile_admin",
    //       "name": "Mobile (Principal / Admin)",
    //       "value": "",
    //       "type": "text",
    //       "mandatory": true,
    //       "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
    //     }
    //   ]
    // },
  
    {
      "section_title": "School Administration / Contacts",
      "fields": [
        {
          "id": "principal_name",
          "name": "Principal Name",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "principal_email",
          "name": "Principal Email",
          "regex": EMAIL_REGEX,
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "admin_contact",
          "name": "Admin / IT Contact",
          "regex":EMAIL_OR_PHONE_REGEX,
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        // {
        //   "id": "admin_phone",
        //   "name": "Admin Phone",
        //   "value": "",
        //   "type": "text",
        //   "mandatory": true,
        //   "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        // }
      ]
    },
  
    // {
    //   "section_title": "Multi-Campus Configuration",
    //   "fields": [
    //     {
    //       "id": "has_campus",
    //       "name": "Does the school have multiple campuses?",
    //       "value": false,
    //       "type": "checkbox",
    //       "mandatory": true,
    //       "width": { "tablet": 6, "desktop": 6, "mobile": 12 }
    //     },
    //     // {
    //     //   "id": "default_campus",
    //     //   "name": "Default Campus Name",
    //     //   "value": "Main Campus",
    //     //   "type": "text",
    //     //   "mandatory": true,
    //     //   "show_if": { "has_campus": false },
    //     //   "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
    //     // }
    //   ]
    // },
  
    // {
    //   "section_title": "Configuration Details",
    //   "fields": [
    //     {
    //       "id": "working_days",
    //       "name": "Working Days",
    //       "value": "",
    //       "type": "dropdown",
    //       "options": ["Mon–Fri", "Mon–Sat"],
    //       "mandatory": true,
    //       "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
    //     },
    //     {
    //       "id": "school_timing",
    //       "name": "School Timing",
    //       "value": "",
    //       "type": "text",
    //       "placeholder": "8:30 AM – 2:30 PM",
    //       "mandatory": false,
    //       "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
    //     },
    //     // {
    //     //   "id": "attendance_mode",
    //     //   "name": "Attendance Mode",
    //     //   "value": "",
    //     //   "type": "dropdown",
    //     //   "options": ["Manual", "QR", "Biometric"],
    //     //   "mandatory": true,
    //     //   "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
    //     // },
    //     {
    //       "id": "timezone",
    //       "name": "Time Zone",
    //       "value": "Asia/Kolkata",
    //       "type": "dropdown",
    //       "options": ["Asia/Kolkata"],
    //       "mandatory": true,
    //       "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
    //     },
    //     {
    //       "id": "default_language",
    //       "name": "Default Language",
    //       "value": "",
    //       "type": "dropdown",
    //       "options": ["English", "Hindi", "Kannada", "Telugu", "Tamil"],
    //       "mandatory": true,
    //       "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
    //     },
    //     // {
    //     //   "id": "academic_start_month",
    //     //   "name": "Academic Start Month",
    //     //   "value": "",
    //     //   "type": "dropdown",
    //     //   "options": [
    //     //     "January","February","March","April","May","June",
    //     //     "July","August","September","October","November","December"
    //     //   ],
    //     //   "mandatory": true,
    //     //   "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
    //     // },
    //     {
    //       "id": "auto_attendance_sync",
    //       "name": "Auto Attendance Sync (minutes)",
    //       "value": "",
    //       "type": "text",
    //       "mandatory": false,
    //       "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
    //     }
    //   ]
    // },
  
    {
      "section_title": "Administrative Information",
      "fields": [
        {
          "id": "affiliation_number",
          "name": "Affiliation Number",
          "value": "",
          "type": "text",
          "mandatory": false,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "registration_number",
          "name": "Registration Number",
          "value": "",
          "type": "text",
          "mandatory": false,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "founded_year",
          "name": "Founded Year",
          "value": "",
          "type": "text",
          "mandatory": false,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "school_category",
          "name": "School Category",
          "value": "",
          "type": "dropdown",
          "options": SCHOOL_CATEGORIES,
          "mandatory": false,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
      ]
    },
  
    
    
  ]
  