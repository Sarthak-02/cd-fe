import { Country, State, City } from "country-state-city";
import {
  DAYS,
  CAMPUS_TYPES,
  LANGUAGES,
  EMAIL_REGEX,
  PHONE_REGEX
} from "../utils/constants/globalConstants";
import { gradingSystemRowFields } from "./dynamicFieldRows.schema";

export const campusSchema = [
  {
    section_title: "campus.sections.basicInformation",
    fields: [
      {
        id: "campus_name",
        name: "campus.fields.campusName",
        value: "",
        type: "text",
        mandatory: true,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      },
      {
        id: "campus_id",
        name: "campus.fields.campusId",
        value: "",
        type: "text",
        mandatory: true,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      },
      {
        id: "campus_type",
        name: "campus.fields.campusType",
        value: "",
        type: "dropdown",
        options: CAMPUS_TYPES,
        mandatory: true,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      }
    ]
  },

  {
    section_title: "campus.sections.contactAddress",
    fields: [
      {
        id: "address_line",
        name: "campus.fields.address",
        value: "",
        type: "text",
        mandatory: true,
        width: { tablet: 12, desktop: 12, mobile: 12 }
      },
      {
        id: "country",
        name: "campus.fields.country",
        value: "IN",
        type: "dropdown",
        options: Country.getAllCountries().map(country => ({
          ...country,
          label: `${country.name} (${country.isoCode})`,
          value: country.isoCode
        })),
        mandatory: true,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
      {
        id: "state",
        name: "campus.fields.state",
        value: "",
        type: "dropdown",
        options: function (form) {
          const { country } = form;
          const states = State.getStatesOfCountry(country);
          return states.map(state => ({
            ...state,
            label: `${state.name} (${state.isoCode})`,
            value: state.isoCode
          }));
        },
        mandatory: true,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
      {
        id: "city",
        name: "campus.fields.city",
        value: "",
        type: "dropdown",
        options: function (form) {
          const { country, state } = form;
          const cities = City.getCitiesOfState(country, state);
          return cities.map(city => ({
            ...city,
            label: city.name,
            value: city.name
          }));
        },
        mandatory: true,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
      {
        id: "pincode",
        name: "campus.fields.pincode",
        value: "",
        type: "text",
        mandatory: true,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
      {
        id: "email",
        name: "campus.fields.email",
        value: "",
        type: "text",
        regex: EMAIL_REGEX,
        mandatory: true,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
      {
        id: "phone_landline",
        name: "campus.fields.phoneLandline",
        value: "",
        type: "text",
        regex: PHONE_REGEX,
        mandatory: false,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
      {
        id: "mobile_admin",
        name: "campus.fields.mobileAdmin",
        value: "",
        type: "text",
        regex: PHONE_REGEX,
        mandatory: true,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      }
    ]
  },

  {
    section_title: "campus.sections.geoLocation",
    fields: [
      {
        id: "campus_latitude",
        name: "campus.fields.latitude",
        value: "",
        type: "number",
        mandatory: true,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      },
      {
        id: "campus_longitude",
        name: "campus.fields.longitude",
        value: "",
        type: "number",
        mandatory: true,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      },
      {
        id: "campus_radius",
        name: "campus.fields.radius",
        value: "",
        type: "number",
        mandatory: true,
        width: { tablet: 6, desktop: 4, mobile: 12 }
      },
      {
        id: "campus_show_map",
        label_key: "campus.fields.showMap",
        value: false,
        type: "button",
        fn: (value, formData, setFormData) => {
          setFormData(prev => ({
            ...prev,
            campus_show_map: !prev.campus_show_map
          }));
        },
        width: { tablet: 6, desktop: 4, mobile: 12 }
      }
    ]
  },

  {
    section_title: "campus.sections.configuration",
    fields: [
      {
        id: "working_days",
        name: "campus.fields.workingDays",
        value: "",
        type: "dropdown",
        multiple: true,
        options: DAYS,
        mandatory: true,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
      {
        id: "campus_timing",
        name: "campus.fields.campusTiming",
        placeholder_key: "campus.placeholders.campusTiming",
        value: "",
        type: "text",
        mandatory: false,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
      {
        id: "timezone",
        name: "campus.fields.timezone",
        value: "Asia/Kolkata",
        type: "dropdown",
        options: function (form) {
          const { country } = form;
          const timezones =
            Country.getCountryByCode(country)?.timezones || [];
          return timezones.map(tz => ({
            ...tz,
            label: `${tz.zoneName} (${tz.abbreviation})`,
            value: tz.abbreviation
          }));
        },
        mandatory: true,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
      {
        id: "default_language",
        name: "campus.fields.defaultLanguage",
        value: "",
        type: "dropdown",
        options: LANGUAGES,
        mandatory: true,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
      
      {
        id: "house_names",
        name: "House Names",
        placeholder: "Select House Names",
        value: [],
        type: "dropdown",
        fn: (value, formData, setFormData) => {
          setFormData(prev => ({
            ...prev,
            house_names: value
          }));
        },
        onAdd: (opt, formData, setFormData) => {
          setFormData(prev => ({
            ...prev,
            house_names: [...prev.house_names, opt]
          }));
        },
        multiple: true,
        allowAdd: true,
        options: (formData) =>{

          const terms = formData?.house_names ?? [];
          return terms.map(term => ({
            value: term,
            label: term
          }));
        },
        mandatory: true,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
      {
        id: "staff_roles",
        name: "Staff Roles",
        placeholder: "Select Staff Roles",
        value: [],
        type: "dropdown",
        fn: (value, formData, setFormData) => {
          setFormData(prev => ({
            ...prev,
            staff_roles: value
          }));
        },
        onAdd: (opt, formData, setFormData) => {
          setFormData(prev => ({
            ...prev,
            staff_roles: [...prev.staff_roles, opt]
          }));
        },
        multiple: true,
        allowAdd: true,
        options: (formData) =>{

          const terms = formData?.staff_roles ?? [];
          return terms.map(term => ({
            value: term,
            label: term
          }));
        },
        mandatory: true,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
      {
        id: "staff_designations",
        name: "Staff Designations",
        placeholder: "Select Staff Designations",
        value: [],
        type: "dropdown",
        fn: (value, formData, setFormData) => {
          setFormData(prev => ({
            ...prev,
            staff_designations: value
          }));
        },
        onAdd: (opt, formData, setFormData) => {
          setFormData(prev => ({
            ...prev,
            staff_designations: [...prev.staff_designations, opt]
          }));
        },
        multiple: true,
        allowAdd: true,
        options: (formData) =>{

          const terms = formData?.staff_designations ?? [];
          return terms.map(term => ({
            value: term,
            label: term
          }));
        },
        mandatory: true,
        width: { tablet: 4, desktop: 4, mobile: 12 }
      },
      { id: "term_start_date", name: "Academic Term Start Date", value: "", type: "date", mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },
      { id: "term_end_date", name: "Academic Term End Date", value: "", type: "date", mandatory: true, width: { tablet: 4, desktop: 4, mobile: 12 } },
      {
        id: "grading_systems",
        name: "Grading Systems",
        value: [],
        type: "dynamic-rows",
        dynamicRowsConfig: {
          fields: gradingSystemRowFields,
          addButtonText: "Add Grading System",
          emptyMessage: "No grading systems configured",
          maxRows: 5
        },
        mandatory: false,
        width: { tablet: 12, desktop: 12, mobile: 12 }
      }
    ]
  }
];
