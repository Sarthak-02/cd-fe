import { generateImageSignedUrl } from "../api/upload.api";
import { GENDER, BLOOD_GROUP, RESERVATION_CATEGORY, STATUS, EMAIL_REGEX, PHONE_REGEX } from "../utils/constants/globalConstants";
import { Country, State, City } from "country-state-city";

export const studentSchema = [
    // ---------------------
    // PERSONAL DETAILS
    // ---------------------
    {
        section_title: "Personal Details",
        fields: [
            { id: "student_admission_no", name: "Admission Number", value: "", type: "text", mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },
            { id: "student_roll_no", name: "Roll Number", value: "", type: "text", mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },

            { id: "student_first_name", name: "First Name", value: "", type: "text", mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },
            { id: "student_middle_name", name: "Middle Name", value: "", type: "text", mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },
            { id: "student_last_name", name: "Last Name", value: "", type: "text", mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },

            { id: "student_gender", name: "Gender", value: "", type: "dropdown", options: GENDER, mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },
            { id: "student_dob", name: "Date of Birth", value: "", type: "date", mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },
            { id: "student_blood_group", name: "Blood Group", value: "", type: "dropdown", options: BLOOD_GROUP, mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },

            {
                id: "student_photo_url", name: "Student Photo", value: "", type: "image", mandatory: false,
                // label:"Studen Photo",
                "accept": ["image/jpeg", "image/png", "image/webp"], maxSize: 2, config: {
                    minWidth: 300,
                    minHeight: 300,
                    maxWidth: 2000,
                    maxHeight: 2000,
                },
                maxFiles: 1,
                fn: async (file, state, setState) => {
                    if (!file) {
                        setState((prev) => ({ ...prev, student_photo_url: "" }))
                        return
                    }
                    const payload = {
                        file,
                        entity: "student",
                        mimeType: file.type,
                        fileSize: file.size,
                        entityId: state?.teacher_employee_code
                    }


                    const { original } = await generateImageSignedUrl(payload)
                    setState((prev) => ({ ...prev, teacher_photo_url: original }))

                },
                width: { tablet: 6, desktop: 4, mobile: 12 }
            }
        ]
    },

    // ---------------------
    // ACADEMIC DETAILS
    // ---------------------
    {
        section_title: "Academic Information",
        fields: [
            { id: "student_admission_date", name: "Admission Date", value: "", type: "date", mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },

            {
                id: "class_id",
                name: "Class",
                value: "",
                type: "dropdown",
                mandatory: true,
                options: [], // load dynamically from API
                width: { tablet: 4, desktop: 4, mobile: 12 }
            },
            {
                id: "section_id",
                name: "Section",
                value: "",
                type: "dropdown",
                mandatory: true,
                options: [], // load dynamically based on class_id
                width: { tablet: 4, desktop: 4, mobile: 12 }
            },

            { id: "student_house_name", name: "House Name", value: "", type: "dropdown", options: [], mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },
            { id: "student_category", name: "Category", value: "", type: "dropdown", options: RESERVATION_CATEGORY, mandatory: false, width: { tablet: 4, desktop: 4, mobile: 12 } },

            { id: "student_current_status", name: "Status", value: "", type: "dropdown", options: STATUS, mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } }
        ]
    },

    // ---------------------
    // STUDENT CONTACT
    // ---------------------
    {
        section_title: "Student Contact Information",
        fields: [
            { id: "student_email", name: "Student Email", value: "",regex:EMAIL_REGEX, type: "text", mandatory: false, width: { tablet: 6, desktop: 6, mobile: 12 } },
            { id: "student_phone", name: "Student Phone", value: "",regex:PHONE_REGEX, type: "text", mandatory: false, width: { tablet: 6, desktop: 6, mobile: 12 } }
        ]
    },

    // ---------------------
    // PARENT / GUARDIAN
    // ---------------------
    {
        section_title: "Parent / Guardian Details",
        fields: [
            { id: "student_father_name", name: "Father's Name", value: "", type: "text", mandatory: true, width: { tablet: 6, desktop: 4, mobile: 12 } },
            { id: "student_mother_name", name: "Mother's Name", value: "", type: "text", mandatory: true, width: { tablet: 6, desktop: 4, mobile: 12 } },

            { id: "student_guardian_name", name: "Guardian Name", value: "", type: "text", mandatory: false, width: { tablet: 6, desktop: 4, mobile: 12 } },
            { id: "student_guardian_relation", name: "Guardian Relation", value: "", type: "text", mandatory: false, width: { tablet: 6, desktop: 4, mobile: 12 } },

            { id: "student_guardian_email", name: "Guardian Email", regex:EMAIL_REGEX,value: "", type: "text", mandatory: false, width: { tablet: 6, desktop: 4, mobile: 12 } },
            { id: "student_guardian_phone", name: "Guardian Phone", regex:PHONE_REGEX,value: "", type: "text", mandatory: true, width: { tablet: 6, desktop: 4, mobile: 12 } }
        ]
    },

    // ---------------------
    // GUARDIAN ADDRESS
    // ---------------------
    {
        section_title: "Guardian Address",
        fields: [
            { id: "student_guardian_address", name: "Address", value: "", type: "text", mandatory: true, width: { tablet: 6, desktop: 6, mobile: 12 } },

            {
                id: "student_guardian_city",
                name: "City",
                value: "",
                type: "dropdown",
                mandatory: true,
                options: function (form) {
                    const { student_guardian_country, student_guardian_state } = form;
                    const cities = City.getCitiesOfState(student_guardian_country, student_guardian_state);
                    return cities.map(city => ({ label: city.name, value: city.name }));
                },
                width: { tablet: 4, desktop: 4, mobile: 12 }
            },

            {
                id: "student_guardian_state",
                name: "State",
                value: "",
                type: "dropdown",
                mandatory: true,
                options: function (form) {
                    const { student_guardian_country } = form;
                    const states = State.getStatesOfCountry(student_guardian_country);
                    return states.map(state => ({ label: `${state.name} (${state.isoCode})`, value: state.isoCode }));
                },
                width: { tablet: 4, desktop: 4, mobile: 12 }
            },

            {
                id: "student_guardian_country",
                name: "Country",
                value: "IN",
                type: "dropdown",
                mandatory: true,
                options: Country.getAllCountries().map(c => ({ label: `${c.name} (${c.isoCode})`, value: c.isoCode })),
                width: { tablet: 4, desktop: 4, mobile: 12 }
            },

            { id: "student_guardian_pincode", name: "Pincode", value: "", type: "text", mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } }
        ]
    },

    // ---------------------
    // EMERGENCY + MEDICAL
    // ---------------------
    {
        section_title: "Emergency & Medical Information",
        fields: [
            { id: "student_emergency_contact_name", name: "Emergency Contact Name", value: "", type: "text", mandatory: true, width: { tablet: 6, desktop: 4, mobile: 12 } },
            { id: "student_emergency_contact_phone", name: "Emergency Contact Phone", regex:PHONE_REGEX, value: "", type: "text", mandatory: true, width: { tablet: 6, desktop: 4, mobile: 12 } },
            { id: "student_medical_conditions", name: "Medical Conditions", value: "", type: "textarea", mandatory: false, width: { tablet: 12, desktop: 12, mobile: 12 } }
        ]
    },

    // ---------------------
    // REMARKS
    // ---------------------
    {
        section_title: "Remarks & Additional Info",
        fields: [
            { id: "student_remarks", name: "Remarks", value: "", type: "textarea", mandatory: false, markdown: true, width: { tablet: 12, desktop: 12, mobile: 12 } }
        ]
    }
];
