/**
 * Example Schema Extensions for DynamicFieldRows
 * 
 * Copy and paste these into your existing schema files to add DynamicFieldRows support
 */

// ===== Example 1: Campus Schema with Grading Systems =====

// Add this to your campus.schema.js:

export const gradingSystemRowFields = [
  {
    id: 'campus_gradingSystem',
    name: 'Grading System Type',
    type: 'dropdown',
    label: 'Grading System Type',
    required: true,
    fn: (value, formData, setFormData) => {
      setFormData(prev => ({
        ...prev,
        campus_gradingSystem: value
      }));
    },
    options: [
      { value: 'numeric', label: 'Numeric (0-100)' },
      { value: 'cgpa', label: 'CGPA/Letter Grades' },
      { value: 'percentage', label: 'Percentage' },
      { value: 'pass_fail', label: 'Pass/Fail' }
    ]
  },
  {
    id: 'campus_available_grades',
    name: 'grades',
    type: 'searchable-dropdown',
    label: 'Available Grades',
    required: true,
    condition: (rowData) => rowData.campus_gradingSystem === 'cgpa',
    allowAdd: true,
    onAdd: (opt, formData, setFormData) => {
      setFormData(prev => ({
        ...prev,
        available_grades: [...prev.available_grades, opt]
      }));
    },
    multiple: true,
    
    options: (formData) =>{

      const grades = formData?.available_grades ?? [];
      return grades.map(term => ({
        value: term,
        label: term
      }));
    },
 
  },
  {
    name: 'minPassingScore',
    type: 'number',
    label: 'Minimum Passing Score',
    required: true,
    condition: (rowData) => 
      rowData.campus_gradingSystem === 'numeric' || 
      rowData.campus_gradingSystem === 'percentage',
    placeholder: 'e.g., 40'
  },
  {
    name: 'maxScore',
    type: 'number',
    label: 'Maximum Score',
    required: true,
    condition: (rowData) => 
      rowData.campus_gradingSystem === 'numeric' || 
      rowData.campus_gradingSystem === 'percentage',
    placeholder: 'e.g., 100'
  },
  {
    name: 'description',
    type: 'text',
    label: 'Description',
    placeholder: 'Optional description (e.g., "For grades 9-12")'
  }
];

// Then add this section to your campusSchema array:
/*
{
  section_title: "campus.sections.gradingConfiguration",
  fields: [
    {
      id: "grading_systems",
      name: "campus.fields.gradingSystems",
      label: "campus.fields.gradingSystems",
      value: [],
      type: "dynamic-rows",
      dynamicRowsConfig: {
        fields: gradingSystemRowFields,
        addButtonText: "Add Grading System",
        emptyMessage: "No grading systems configured yet. Add at least one.",
        maxRows: 5,
        minRows: 0
      },
      mandatory: false,
      width: { tablet: 12, desktop: 12, mobile: 12 }
    }
  ]
}
*/

// ===== Example 2: Teacher Schema with Certifications =====

// Add this to your teacher.schema.js:

export const certificationRowFields = [
  {
    name: 'certificationType',
    type: 'dropdown',
    label: 'Certification Type',
    required: true,
    options: [
      { value: 'degree', label: 'Degree' },
      { value: 'diploma', label: 'Diploma' },
      { value: 'certificate', label: 'Certificate' },
      { value: 'training', label: 'Professional Training' },
      { value: 'license', label: 'License' }
    ]
  },
  {
    name: 'degreeLevel',
    type: 'dropdown',
    label: 'Degree Level',
    required: true,
    condition: (rowData) => rowData.certificationType === 'degree',
    options: [
      { value: 'bachelor', label: "Bachelor's Degree" },
      { value: 'master', label: "Master's Degree" },
      { value: 'doctorate', label: 'Doctorate (PhD)' }
    ]
  },
  {
    name: 'title',
    type: 'text',
    label: 'Certification Title',
    required: true,
    placeholder: 'e.g., Master of Education'
  },
  {
    name: 'institution',
    type: 'text',
    label: 'Institution/Organization',
    required: true,
    placeholder: 'e.g., University of California'
  },
  {
    name: 'yearObtained',
    type: 'number',
    label: 'Year Obtained',
    required: true,
    placeholder: 'e.g., 2020'
  },
  {
    name: 'expiryYear',
    type: 'number',
    label: 'Expiry Year',
    condition: (rowData) => rowData.certificationType === 'license',
    placeholder: 'e.g., 2026'
  },
  {
    name: 'verified',
    type: 'checkbox',
    label: 'Verification Complete'
  }
];

// Add this section to your teacherSchema:
/*
{
  section_title: "teacher.sections.certifications",
  fields: [
    {
      id: "certifications",
      name: "teacher.fields.certifications",
      label: "teacher.fields.certifications",
      value: [],
      type: "dynamic-rows",
      dynamicRowsConfig: {
        fields: certificationRowFields,
        addButtonText: "Add Certification",
        emptyMessage: "No certifications added. Add teacher's qualifications.",
        maxRows: 10
      },
      mandatory: false,
      width: { tablet: 12, desktop: 12, mobile: 12 }
    }
  ]
}
*/

// ===== Example 3: Campus/School Notification Settings =====

export const notificationRowFields = [
  {
    name: 'notificationType',
    type: 'dropdown',
    label: 'Notification Type',
    required: true,
    options: [
      { value: 'attendance', label: 'Attendance Alerts' },
      { value: 'grades', label: 'Grade Updates' },
      { value: 'announcement', label: 'General Announcements' },
      { value: 'emergency', label: 'Emergency Alerts' },
      { value: 'fee', label: 'Fee Reminders' },
      { value: 'event', label: 'Event Reminders' }
    ]
  },
  {
    name: 'channels',
    type: 'multi-select',
    label: 'Enabled Channels',
    required: true,
    options: [
      { value: 'email', label: 'Email' },
      { value: 'sms', label: 'SMS' },
      { value: 'push', label: 'Push Notification' },
      { value: 'in_app', label: 'In-App Notification' }
    ]
  },
  {
    name: 'recipients',
    type: 'multi-select',
    label: 'Recipients',
    required: true,
    options: [
      { value: 'students', label: 'Students' },
      { value: 'parents', label: 'Parents/Guardians' },
      { value: 'teachers', label: 'Teachers' },
      { value: 'staff', label: 'Staff' },
      { value: 'admin', label: 'Administrators' }
    ]
  },
  {
    name: 'priority',
    type: 'dropdown',
    label: 'Priority Level',
    required: true,
    options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'critical', label: 'Critical' }
    ]
  },
  {
    name: 'autoSend',
    type: 'checkbox',
    label: 'Send Automatically'
  },
  {
    name: 'enabled',
    type: 'checkbox',
    label: 'Enable This Rule'
  }
];

// ===== Example 4: Student Emergency Contacts =====

export const emergencyContactRowFields = [
  {
    name: 'relationship',
    type: 'dropdown',
    label: 'Relationship',
    required: true,
    options: [
      { value: 'parent', label: 'Parent' },
      { value: 'guardian', label: 'Legal Guardian' },
      { value: 'sibling', label: 'Sibling' },
      { value: 'grandparent', label: 'Grandparent' },
      { value: 'other', label: 'Other Relative' }
    ]
  },
  {
    name: 'otherRelationship',
    type: 'text',
    label: 'Specify Relationship',
    required: true,
    condition: (rowData) => rowData.relationship === 'other',
    placeholder: 'e.g., Uncle, Aunt'
  },
  {
    name: 'fullName',
    type: 'text',
    label: 'Full Name',
    required: true,
    placeholder: 'Contact person full name'
  },
  {
    name: 'primaryPhone',
    type: 'tel',
    label: 'Primary Phone',
    required: true,
    placeholder: '+1 (555) 000-0000'
  },
  {
    name: 'alternatePhone',
    type: 'tel',
    label: 'Alternate Phone',
    placeholder: '+1 (555) 000-0000'
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'email@example.com'
  },
  {
    name: 'isPrimary',
    type: 'checkbox',
    label: 'Primary Emergency Contact'
  },
  {
    name: 'canPickup',
    type: 'checkbox',
    label: 'Authorized to Pick Up Student'
  }
];

// ===== Example 5: Class/Section Subject Configuration =====

export const subjectRowFields = [
  {
    name: 'subjectName',
    type: 'text',
    label: 'Subject Name',
    required: true,
    placeholder: 'e.g., Mathematics'
  },
  {
    name: 'subjectCode',
    type: 'text',
    label: 'Subject Code',
    required: true,
    placeholder: 'e.g., MATH-101'
  },
  {
    name: 'subjectType',
    type: 'dropdown',
    label: 'Subject Type',
    required: true,
    options: [
      { value: 'core', label: 'Core Subject' },
      { value: 'elective', label: 'Elective' },
      { value: 'optional', label: 'Optional' },
      { value: 'extracurricular', label: 'Extra-Curricular' }
    ]
  },
  {
    name: 'teacher',
    type: 'searchable-dropdown',
    label: 'Assigned Teacher',
    required: true,
    // This would use dynamic options from your teacher API
    options: (rowData) => {
      // This would be replaced with actual API call
      return [
        { value: 'teacher1', label: 'John Doe' },
        { value: 'teacher2', label: 'Jane Smith' }
      ];
    }
  },
  {
    name: 'hoursPerWeek',
    type: 'number',
    label: 'Hours Per Week',
    required: true,
    placeholder: 'e.g., 5'
  },
  {
    name: 'hasLab',
    type: 'checkbox',
    label: 'Has Lab Component'
  },
  {
    name: 'labHours',
    type: 'number',
    label: 'Lab Hours Per Week',
    required: true,
    condition: (rowData) => rowData.hasLab === true,
    placeholder: 'e.g., 2'
  }
];

// ===== Translation Keys to Add =====

/*
Add these to your translation.json files:

For Campus:
{
  "campus": {
    "sections": {
      "gradingConfiguration": "Grading Configuration"
    },
    "fields": {
      "gradingSystems": "Grading Systems"
    }
  }
}

For Teacher:
{
  "teacher": {
    "sections": {
      "certifications": "Certifications & Qualifications"
    },
    "fields": {
      "certifications": "Certifications"
    }
  }
}
*/
