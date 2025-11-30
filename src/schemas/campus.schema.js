export const campusSchema = [
    {
      "section_title": "Basic campus Information",
      "fields": [
        {
          "id": "campus_name",
          "name": "Campus Name",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "campus_code",
          "name": "campus Code / ID",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "campus_type",
          "name": "campus Type",
          "value": "",
          "type": "dropdown",
          "options": ["CBSE", "ICSE", "State Board", "IB", "IGCSE"],
          "mandatory": true,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
      
      ]
    },
  
    {
      "section_title": "Contact & Address Details",
      "fields": [
        {
          "id": "address_line",
          "name": "Address",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 12, "desktop": 12, "mobile": 12 }
        },
        {
          "id": "city",
          "name": "City",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "state",
          "name": "State / Province",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "country",
          "name": "Country",
          "value": "India",
          "type": "dropdown",
          "options": ["India"],
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "pincode",
          "name": "Pincode / ZIP Code",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "email",
          "name": "Email",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "phone_landline",
          "name": "Phone (Landline)",
          "value": "",
          "type": "text",
          "mandatory": false,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "mobile_admin",
          "name": "Mobile (Principal / Admin)",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        }
      ]
    },
  
    {
      "section_title": "Configuration Details",
      "fields": [
        {
          "id": "working_days",
          "name": "Working Days",
          "value": "",
          "type": "dropdown",
          "options": ["Mon–Fri", "Mon–Sat"],
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "campus_timing",
          "name": "campus Timing",
          "value": "",
          "type": "text",
          "placeholder": "8:30 AM – 2:30 PM",
          "mandatory": false,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        // {
        //   "id": "attendance_mode",
        //   "name": "Attendance Mode",
        //   "value": "",
        //   "type": "dropdown",
        //   "options": ["Manual", "QR", "Biometric"],
        //   "mandatory": true,
        //   "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        // },
        {
          "id": "timezone",
          "name": "Time Zone",
          "value": "Asia/Kolkata",
          "type": "dropdown",
          "options": ["Asia/Kolkata"],
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "default_language",
          "name": "Default Language",
          "value": "",
          "type": "dropdown",
          "options": ["English", "Hindi", "Kannada", "Telugu", "Tamil"],
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        // {
        //   "id": "academic_start_month",
        //   "name": "Academic Start Month",
        //   "value": "",
        //   "type": "dropdown",
        //   "options": [
        //     "January","February","March","April","May","June",
        //     "July","August","September","October","November","December"
        //   ],
        //   "mandatory": true,
        //   "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        // },
        // {
        //   "id": "auto_attendance_sync",
        //   "name": "Auto Attendance Sync (minutes)",
        //   "value": "",
        //   "type": "text",
        //   "mandatory": false,
        //   "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        // }
      ]
    }   
  ]
  