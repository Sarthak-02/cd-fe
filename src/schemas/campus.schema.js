import { Country , State , City } from "country-state-city"
import { DAYS , CAMPUS_TYPES , LANGUAGES, EMAIL_REGEX, PHONE_REGEX } from "../utils/constants/globalConstants"

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
          "id": "campus_id",
          "name": "campus Code / ID",
          "value": "",
          "type": "text",
          "mandatory": true,
          "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "campus_type",
          "name": "Campus Type",
          "value": "",
          "type": "dropdown",
          "options": CAMPUS_TYPES,
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
          "type": "dropdown",
          "options":function(form){
            const {country,state} = form
            const cities = City.getCitiesOfState(country,state)

            return cities.map(city => ({...city, label : city.name,value:city.name }))
          },
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "state",
          "name": "State / Province",
          "value": "",
          "type": "dropdown",
          "options": function(form){
            const {country} =form
            const states = State.getStatesOfCountry(country)
            return states.map(state => ({...state, label : `${state.name} (${state.isoCode})`,value:state.isoCode}))
          },
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "country",
          "name": "Country",
          "value": "India",
          "type": "dropdown",
          "options": function(){
            const countries = Country.getAllCountries()
            return countries.map(country => ({...country, label:`${country.name} (${country.isoCode})` , value: country.isoCode}) )
          }(),
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
          "regex": EMAIL_REGEX,
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "phone_landline",
          "name": "Phone (Landline)",
          "regex":PHONE_REGEX,
          "value": "",
          "type": "text",
          "mandatory": false,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "mobile_admin",
          "name": "Mobile (Principal / Admin)",
          "value": "",
          "regex":PHONE_REGEX,
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
          "multiple":true,
          "options": DAYS,
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "campus_timing",
          "name": "Campus Timing",
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
          "options": function(form){
            const {country} = form
            const timezones = Country.getCountryByCode(country)?.timezones || [] 

            return timezones?.map((timezone) => ({...timezone,label: `${timezone.zoneName} (${timezone.abbreviation})` , value:timezone.abbreviation}))

          },
          "mandatory": true,
          "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
        },
        {
          "id": "default_language",
          "name": "Default Language",
          "value": "",
          "type": "dropdown",
          "options": LANGUAGES,
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
  