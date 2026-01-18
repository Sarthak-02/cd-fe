/**
 * Example: Using DynamicFieldRows in Campus Form
 * 
 * This file demonstrates how to integrate the DynamicFieldRows component
 * into your existing campus form for configuring grading systems.
 */

// ===== Step 1: Define your field configurations =====

// Example 1: Grading System Configuration
export const gradingSystemFields = [
  {
    name: 'gradingSystem',
    type: 'dropdown',
    label: 'Grading System',
    required: true,
    options: [
      { value: 'numeric', label: 'Numeric (0-100)' },
      { value: 'cgpa', label: 'CGPA/Letter Grades' },
      { value: 'percentage', label: 'Percentage' },
      { value: 'pass_fail', label: 'Pass/Fail' }
    ]
  },
  {
    name: 'grades',
    type: 'multi-select',
    label: 'Available Grades',
    required: true,
    // Only show when CGPA is selected
    condition: (rowData) => rowData.gradingSystem === 'cgpa',
    options: [
      { value: 'a+', label: 'A+ (Outstanding)' },
      { value: 'a', label: 'A (Excellent)' },
      { value: 'b+', label: 'B+ (Very Good)' },
      { value: 'b', label: 'B (Good)' },
      { value: 'c+', label: 'C+ (Above Average)' },
      { value: 'c', label: 'C (Average)' },
      { value: 'd', label: 'D (Pass)' },
      { value: 'f', label: 'F (Fail)' }
    ]
  },
  {
    name: 'minPassingScore',
    type: 'number',
    label: 'Minimum Passing Score',
    required: true,
    // Only show for numeric or percentage systems
    condition: (rowData) => 
      rowData.gradingSystem === 'numeric' || 
      rowData.gradingSystem === 'percentage',
    placeholder: 'e.g., 40'
  },
  {
    name: 'description',
    type: 'text',
    label: 'Description',
    placeholder: 'Optional description'
  }
];

// Example 2: Notification Channel Configuration
export const notificationChannelFields = [
  {
    name: 'notificationType',
    type: 'dropdown',
    label: 'Notification Type',
    required: true,
    options: [
      { value: 'attendance', label: 'Attendance Alert' },
      { value: 'grades', label: 'Grade Updates' },
      { value: 'announcement', label: 'General Announcements' },
      { value: 'emergency', label: 'Emergency Alerts' },
      { value: 'fee', label: 'Fee Reminders' }
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
    name: 'enabled',
    type: 'checkbox',
    label: 'Enable this notification rule'
  }
];

// Example 3: Academic Session Configuration
export const academicSessionFields = [
  {
    name: 'sessionName',
    type: 'text',
    label: 'Session Name',
    required: true,
    placeholder: 'e.g., Spring 2026'
  },
  {
    name: 'sessionType',
    type: 'dropdown',
    label: 'Session Type',
    required: true,
    options: [
      { value: 'semester', label: 'Semester' },
      { value: 'trimester', label: 'Trimester' },
      { value: 'quarter', label: 'Quarter' },
      { value: 'annual', label: 'Annual' }
    ]
  },
  {
    name: 'startDate',
    type: 'text',
    label: 'Start Date',
    required: true,
    placeholder: 'YYYY-MM-DD'
  },
  {
    name: 'endDate',
    type: 'text',
    label: 'End Date',
    required: true,
    placeholder: 'YYYY-MM-DD'
  }
];

// Example 4: Emergency Contact Configuration
export const emergencyContactFields = [
  {
    name: 'contactType',
    type: 'dropdown',
    label: 'Contact Type',
    required: true,
    options: [
      { value: 'parent', label: 'Parent' },
      { value: 'guardian', label: 'Guardian' },
      { value: 'relative', label: 'Relative' },
      { value: 'other', label: 'Other' }
    ]
  },
  {
    name: 'name',
    type: 'text',
    label: 'Full Name',
    required: true,
    placeholder: 'Contact person name'
  },
  {
    name: 'relationship',
    type: 'text',
    label: 'Relationship',
    required: true,
    // Only show for 'other' contact type
    condition: (rowData) => rowData.contactType === 'other',
    placeholder: 'Specify relationship'
  },
  {
    name: 'phoneNumber',
    type: 'tel',
    label: 'Phone Number',
    required: true,
    placeholder: '+1 (555) 000-0000'
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'email@example.com'
  }
];

// ===== Step 2: Example usage in a React component =====

/*
import React, { useState } from 'react';
import { DynamicFieldRows } from '../ui-components';
import { gradingSystemFields } from './dynamicFieldExamples';

function CampusForm() {
  const [formData, setFormData] = useState({
    campus_name: '',
    campus_id: '',
    gradingSystems: [], // Array to store grading system configurations
    notificationChannels: [] // Array to store notification configurations
  });

  const handleGradingSystemsChange = (newGradingSystems) => {
    setFormData({
      ...formData,
      gradingSystems: newGradingSystems
    });
  };

  return (
    <form>
      // ... other form fields ...
      
      <div className="form-section">
        <h3 className="text-lg font-semibold mb-4">Grading Systems</h3>
        <DynamicFieldRows
          fields={gradingSystemFields}
          value={formData.gradingSystems}
          onChange={handleGradingSystemsChange}
          addButtonText="Add Grading System"
          emptyMessage="No grading systems configured yet"
          maxRows={5}
        />
      </div>

      <div className="form-section mt-6">
        <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
        <DynamicFieldRows
          fields={notificationChannelFields}
          value={formData.notificationChannels}
          onChange={(newChannels) => setFormData({ ...formData, notificationChannels: newChannels })}
          addButtonText="Add Notification Rule"
          emptyMessage="No notification rules configured"
          minRows={0}
        />
      </div>

      // ... submit button ...
    </form>
  );
}
*/

// ===== Step 3: Integration with your existing DynamicForm =====

/*
If you want to integrate DynamicFieldRows into your existing DynamicForm component,
you can add a new field type 'dynamic-rows' and handle it like this:

In your schema file (e.g., campus.schema.js):

export const campusSchema = [
  {
    section_title: "campus.sections.basicInformation",
    fields: [
      // ... existing fields ...
    ]
  },
  {
    section_title: "campus.sections.gradingConfiguration",
    fields: [
      {
        id: "grading_systems",
        name: "campus.fields.gradingSystems",
        value: [],
        type: "dynamic-rows",
        dynamicRowsConfig: {
          fields: gradingSystemFields,
          addButtonText: "Add Grading System",
          emptyMessage: "No grading systems configured",
          maxRows: 5
        },
        width: { tablet: 12, desktop: 12, mobile: 12 }
      }
    ]
  }
];

Then in your DynamicForm component, add handling for this type:

case 'dynamic-rows':
  return (
    <DynamicFieldRows
      fields={field.dynamicRowsConfig.fields}
      value={field.value}
      onChange={(newValue) => handleFieldChange(field.id, newValue)}
      addButtonText={field.dynamicRowsConfig.addButtonText}
      emptyMessage={field.dynamicRowsConfig.emptyMessage}
      maxRows={field.dynamicRowsConfig.maxRows}
      minRows={field.dynamicRowsConfig.minRows}
    />
  );
*/

// ===== Step 4: Sending data to API =====

/*
When submitting the form, the data will be structured like this:

{
  campus_name: "Main Campus",
  campus_id: "CAMP001",
  gradingSystems: [
    {
      gradingSystem: "numeric",
      minPassingScore: "40",
      description: "Standard numeric grading"
    },
    {
      gradingSystem: "cgpa",
      grades: ["a+", "a", "b+", "b", "c", "d"],
      description: "CGPA for senior classes"
    }
  ],
  notificationChannels: [
    {
      notificationType: "attendance",
      channels: ["email", "sms"],
      priority: "high",
      enabled: true
    },
    {
      notificationType: "emergency",
      channels: ["email", "sms", "push"],
      priority: "critical",
      enabled: true
    }
  ]
}

You can then send this data to your API:

const response = await campusApi.create(formData);
*/
