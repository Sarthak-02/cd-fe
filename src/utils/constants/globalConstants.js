export const MODE = {
  NONE: 0,
  CREATE: 1,
  EDIT: 2,
};

export const DAYS = [
  {
    value: 'monday',
    label: 'Monday'
  },
  {
    value: 'tuesday',
    label: 'Tuesday'
  },
  {
    value: 'wednesday',
    label: 'Wednesday'
  },
  {
    value: 'thursday',
    label: 'Thursday'
  },
  {
    value: 'friday',
    label: 'Friday'
  },
  {
    value: 'saturday',
    label: 'Saturday'
  },
  {
    value: 'sunday',
    label: 'Sunday'
  },

]

export const CAMPUS_TYPES = [
  { "label": "Central Board of Secondary Education", "value": "cbse" },
  { "label": "Council for the Indian School Certificate Examinations", "value": "cisce" },
  { "label": "National Institute of Open Schooling", "value": "nios" },
  { "label": "International Baccalaureate", "value": "ib" },
  { "label": "Cambridge Assessment International Education", "value": "caie" },
  { "label": "State Board – Andhra Pradesh", "value": "ap_state" },
  { "label": "State Board – Telangana", "value": "ts_state" },
  { "label": "State Board – Tamil Nadu", "value": "tn_state" },
  { "label": "State Board – Kerala", "value": "kl_state" },
  { "label": "State Board – Karnataka", "value": "ka_state" },
  { "label": "State Board – Maharashtra", "value": "mh_state" },
  { "label": "State Board – Gujarat", "value": "gj_state" },
  { "label": "State Board – Rajasthan", "value": "rj_state" },
  { "label": "State Board – Uttar Pradesh", "value": "up_state" },
  { "label": "State Board – Madhya Pradesh", "value": "mp_state" },
  { "label": "State Board – Bihar", "value": "br_state" },
  { "label": "State Board – West Bengal", "value": "wb_state" },
  { "label": "State Board – Odisha", "value": "od_state" },
  { "label": "State Board – Punjab", "value": "pb_state" },
  { "label": "State Board – Haryana", "value": "hr_state" },
  { "label": "State Board – Himachal Pradesh", "value": "hp_state" },
  { "label": "State Board – Uttarakhand", "value": "uk_state" },
  { "label": "State Board – Goa", "value": "ga_state" },
  { "label": "State Board – Chhattisgarh", "value": "cg_state" },
  { "label": "State Board – Jharkhand", "value": "jh_state" },
  { "label": "State Board – Assam", "value": "as_state" },
  { "label": "State Board – Tripura", "value": "tr_state" },
  { "label": "State Board – Meghalaya", "value": "ml_state" },
  { "label": "State Board – Manipur", "value": "mn_state" },
  { "label": "State Board – Mizoram", "value": "mz_state" },
  { "label": "State Board – Nagaland", "value": "nl_state" },
  { "label": "State Board – Sikkim", "value": "sk_state" },
  { "label": "State Board – Arunachal Pradesh", "value": "ar_state" },
  { "label": "State Board – Delhi", "value": "dl_state" },
  { "label": "State Board – Jammu & Kashmir", "value": "jk_state" }
]

export const LANGUAGES = [
  { "label": "Assamese", "value": "as" },
  { "label": "Bengali", "value": "bn" },
  { "label": "Bodo", "value": "brx" },
  { "label": "Dogri", "value": "doi" },
  { "label": "Gujarati", "value": "gu" },
  { "label": "Hindi", "value": "hi" },
  { "label": "Kannada", "value": "kn" },
  { "label": "Kashmiri", "value": "ks" },
  { "label": "Konkani", "value": "kok" },
  { "label": "Maithili", "value": "mai" },
  { "label": "Malayalam", "value": "ml" },
  { "label": "Manipuri (Meitei)", "value": "mni" },
  { "label": "Marathi", "value": "mr" },
  { "label": "Nepali", "value": "ne" },
  { "label": "Odia", "value": "or" },
  { "label": "Punjabi", "value": "pa" },
  { "label": "Sanskrit", "value": "sa" },
  { "label": "Santali", "value": "sat" },
  { "label": "Sindhi", "value": "sd" },
  { "label": "Tamil", "value": "ta" },
  { "label": "Telugu", "value": "te" },
  { "label": "Urdu", "value": "ur" },
  { "label": "English", "value": "en" }
]

export const CLASS_TYPE = [
  {
    label: "Primary",
    value: "primary"
  },
  {
    label: "Secondary",
    value: "secondary"
  },
  {
    label: "Higher",
    value: "higher"
  }
]

export const COURSE = [
  {
    label: "Science",
    value: "science"
  },
  {
    label: "Commerce",
    value: "commerce"
  },
  {
    label: "Arts",
    value: "arts"
  }
]

export const CLASS_SHIFT = [
  {
    label: "Morning",
    value: "morning"
  },
  {
    label: "Evening",
    value: "evening"
  }
]

export const BLOOD_GROUP = [
  { "label": "A+", "value": "a_plus" },
  { "label": "A-", "value": "a_minus" },
  { "label": "B+", "value": "b_plus" },
  { "label": "B-", "value": "b_minus" },
  { "label": "AB+", "value": "ab_plus" },
  { "label": "AB-", "value": "ab_minus" },
  { "label": "O+", "value": "o_plus" },
  { "label": "O-", "value": "o_minus" }
]

export const MARITAL_STATUS = [
  { "label": "Single", "value": "single" },
  { "label": "Married", "value": "married" },
  { "label": "Divorced", "value": "divorced" },
  { "label": "Widowed", "value": "widowed" }
]

export const GENDER = [
  { "label": "Male", "value": "Male" },
  { "label": "Female", "value": "Female" },
  { "label": "Other", "value": "Other" }
]

export const TEACHER_DESIGNATION = [
  { "label": "PGT", "value": "pgt" },
  { "label": "TGT", "value": "tgt" },
  { "label": "PRT", "value": "prt" },
  { "label": "Principal", "value": "principal" },
  { "label": "HM", "value": "hm" },
  { "label": "Admin", "value": "admin" }
]

export const EMPLOYMNENT_TYPE = [
  { "label": "Permanent", "value": "permanent" },
  { "label": "Contract", "value": "contract" },
  { "label": "Temporary", "value": "temporary" }
]

export const ROLES = [
  { "label": "Teacher", "value": "teacher" },
  { "label": "Admin", "value": "admin" },
  { "label": "Coordinator", "value": "coordinator" }
]

export const STATUS = [
  { "label": "Active", "value": "active" },
  { "label": "Inactive", "value": "inactive" }
]

export const RESERVATION_CATEGORY = [
  { "label": "General", "value": "gen" },
  { "label": "SC", "value": "sc" },
  { "label": "ST", "value": "st" },
  { "label": "OBC", "value": "obc" },
  { "label": "EWS", "value": "ews" }
]

export const SCHOOL_CATEGORIES = [
  { "label": "Primary", "value": "primary" },
  { "label": "Secondary", "value": "secondary" },
  { "label": "Senior Secondary", "value": "senior_secondary" }
]

export const SCHOOL_TYPE = [
  { value: "cbse", label: "CBSE" },
  { value: "icse", label: "ICSE" },
  { value: "state_board", label: "State Board" },
  { value: "ib", label: "IB" },
  { value: "igcse", label: "IGCSE" }
]

export const PRIMARY_CONTACT = [
  { value: "father", label: "Father" },
  { value: "mother", label: "Mother" },
  { value: "guardian", label: "Guardian" }
]

export const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const PHONE_REGEX = /^(?:\+91|0)?[6-9]\d{9}$/;
export const EMAIL_OR_PHONE_REGEX = /^(?:[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|(?:\+91|0)?[6-9]\d{9})$/;
