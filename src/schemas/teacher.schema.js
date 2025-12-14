import { generateImageSignedUrl } from "../api/upload.api";
import { EMPLOYMNENT_TYPE, GENDER, BLOOD_GROUP, MARITAL_STATUS, ROLES, STATUS, TEACHER_DESIGNATION } from "../utils/constants/globalConstants";
import { Country, State, City } from "country-state-city"
export const teacherSchema = [
    {
        "section_title": "Personal Details",
        "fields": [
            { "id": "teacher_employee_code", "name": "Employee Code", "value": "", "type": "text", "mandatory": true, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_first_name", "name": "First Name", "value": "", "type": "text", "mandatory": true, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_middle_name", "name": "Middle Name", "value": "", "type": "text", "mandatory": false, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_last_name", "name": "Last Name", "value": "", "type": "text", "mandatory": false, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_gender", "name": "Gender", "value": "", "type": "dropdown", "options": GENDER, "mandatory": false, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_dob", "name": "Date of Birth", "value": "", "type": "date", "mandatory": true, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_blood_group", "name": "Blood Group", "value": "", "type": "dropdown", "options": BLOOD_GROUP, "mandatory": false, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_nationality", "name": "Nationality", "value": "Indian", "type": "text", "mandatory": false, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_religion", "name": "Religion", "value": "", "type": "text", "mandatory": false, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_marital_status", "name": "Marital Status", "value": "", "type": "dropdown", "options": MARITAL_STATUS, "mandatory": false, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            {
                "id": "teacher_photo_url", "name": "Teacher Photo", "value": "", "type": "image", "accept": ["image/jpeg", "image/png", "image/webp"], maxSize: 2, config: {
                    minWidth: 300,
                    minHeight: 300,
                    maxWidth: 2000,
                    maxHeight: 2000,
                }, 
                maxFiles:1,
                fn:async (file,state,setState)=>{
                    if(!file){
                        setState((prev) => ({...prev,teacher_photo_url:""}))
                        return
                    }
                    const payload = {
                        file,
                        entity:"teacher",
                        mimeType:file.type,
                        fileSize : file.size,
                        entityId:state?.teacher_employee_code
                    }
                    

                    const {original} = await generateImageSignedUrl(payload)
                    setState((prev) => ({...prev,teacher_photo_url:original}))

                },
                "mandatory": false, "width": { "tablet": 6, "desktop": 4, "mobile": 12 }
            }
        ]
    },

    {
        "section_title": "Contact Information",
        "fields": [
            { "id": "teacher_email", "name": "Email", "value": "", "type": "text", "mandatory": true, "width": { "tablet": 6, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_phone", "name": "Phone Number", "value": "", "type": "text", "mandatory": true, "width": { "tablet": 6, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_address_line", "name": "Address Line", "value": "", "type": "text", "mandatory": true, "width": { "tablet": 6, "desktop": 6, "mobile": 12 } },
            {
                "id": "teacher_city", "name": "City", "value": "", "type": "dropdown", "mandatory": true, options: function (form) {
                    const { teacher_country, teacher_state } = form
                    const cities = City.getCitiesOfState(teacher_country, teacher_state)

                    return cities.map(city => ({ ...city, label: city.name, value: city.name }))
                }, "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
            },
            {
                "id": "teacher_state", "name": "State", "value": "", "type": "dropdown", "mandatory": true, options: function (form) {
                    const { teacher_country } = form
                    const states = State.getStatesOfCountry(teacher_country)
                    return states.map(state => ({ ...state, label: `${state.name} (${state.isoCode})`, value: state.isoCode }))
                }, "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
            },
            {
                "id": "teacher_country", "name": "Country", "value": "India", "type": "dropdown", "options": function () {
                    const countries = Country.getAllCountries()
                    return countries.map(country => ({ ...country, label: `${country.name} (${country.isoCode})`, value: country.isoCode }))
                }(),
                "mandatory": true, "width": { "tablet": 4, "desktop": 4, "mobile": 12 }
            },
            { "id": "teacher_pincode", "name": "Pincode", "value": "", "type": "text", "mandatory": true, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } }
        ]
    },

    {
        "section_title": "Professional Details",
        "fields": [
            { "id": "teacher_qualification", "name": "Qualification", "value": "", "type": "text", "mandatory": false, "width": { "tablet": 6, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_experience_years", "name": "Experience (Years)", "value": "", "type": "number", "mandatory": false, "width": { "tablet": 3, "desktop": 3, "mobile": 12 } },
            { "id": "teacher_subjects", "name": "Subjects", "value": [], "type": "multiselect", "options": [], "mandatory": false, "width": { "tablet": 6, "desktop": 6, "mobile": 12 } },
            { "id": "teacher_designation", "name": "Designation", "value": "", "type": "dropdown", "options": TEACHER_DESIGNATION, "mandatory": false, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_department", "name": "Department", "value": "", "type": "text", "mandatory": false, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_employment_type", "name": "Employment Type", "value": "", "type": "dropdown", "options": EMPLOYMNENT_TYPE, "mandatory": false, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_doj", "name": "Date of Joining", "value": "", "type": "date", "mandatory": true, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_dol", "name": "Date of Leaving", "value": "", "type": "date", "mandatory": false, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } }
        ]
    },

    {
        "section_title": "System Access",
        "fields": [
            { "id": "teacher_user_id", "name": "Linked User", "value": "", "type": "dropdown", "options": [], "mandatory": false, "width": { "tablet": 6, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_role", "name": "Role", "value": "", "type": "dropdown", "options": ROLES, "mandatory": true, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } },
            { "id": "teacher_status", "name": "Status", "value": "", "type": "dropdown", "options": STATUS, "mandatory": true, "width": { "tablet": 4, "desktop": 4, "mobile": 12 } }
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
