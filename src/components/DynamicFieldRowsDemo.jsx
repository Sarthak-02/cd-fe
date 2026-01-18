import React, { useState } from 'react';
import DynamicFieldRows from '../ui-components/DynamicFieldRows';
import { gradingSystemRowFields } from '../schemas/dynamicFieldRows.schema';
/**
 * Demo component to showcase DynamicFieldRows functionality
 * You can import this in your App.jsx or any page to test the component
 */
const DynamicFieldRowsDemo = () => {
  const [gradingSystems, setGradingSystems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [contacts, setContacts] = useState([]);

  // Example 1: Grading System Configuration
  // const gradingFields = [
  //   {
  //     name: 'gradingSystem',
  //     type: 'dropdown',
  //     label: 'Grading System',
  //     required: true,
  //     options: [
  //       { value: 'numeric', label: 'Numeric (0-100)' },
  //       { value: 'cgpa', label: 'CGPA/Letter Grades' },
  //       { value: 'percentage', label: 'Percentage' },
  //       { value: 'pass_fail', label: 'Pass/Fail' }
  //     ]
  //   },
  //   {
  //     name: 'grades',
  //     type: 'multi-select',
  //     label: 'Available Grades',
  //     required: true,
  //     condition: (rowData) => rowData.gradingSystem === 'cgpa',
  //     options: [
  //       { value: 'a+', label: 'A+' },
  //       { value: 'a', label: 'A' },
  //       { value: 'b+', label: 'B+' },
  //       { value: 'b', label: 'B' },
  //       { value: 'c+', label: 'C+' },
  //       { value: 'c', label: 'C' },
  //       { value: 'd', label: 'D' },
  //       { value: 'f', label: 'F' }
  //     ]
  //   },
  //   {
  //     name: 'minPassingScore',
  //     type: 'number',
  //     label: 'Minimum Passing Score',
  //     required: true,
  //     condition: (rowData) => 
  //       rowData.gradingSystem === 'numeric' || 
  //       rowData.gradingSystem === 'percentage',
  //     placeholder: 'e.g., 40'
  //   },
  //   {
  //     name: 'description',
  //     type: 'text',
  //     label: 'Description',
  //     placeholder: 'Optional description'
  //   }
  // ];
  const gradingFields = gradingSystemRowFields;
  // Example 2: Notification Channels
  const notificationFields = [
    {
      name: 'notificationType',
      type: 'dropdown',
      label: 'Notification Type',
      required: true,
      options: [
        { value: 'attendance', label: 'Attendance Alert' },
        { value: 'grades', label: 'Grade Updates' },
        { value: 'announcement', label: 'Announcements' },
        { value: 'emergency', label: 'Emergency Alerts' }
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
        { value: 'in_app', label: 'In-App' }
      ]
    },
    {
      name: 'priority',
      type: 'dropdown',
      label: 'Priority',
      required: true,
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' }
      ]
    },
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Enable this rule'
    }
  ];

  // Example 3: Contact Information with Dynamic Fields
  const contactFields = [
    {
      name: 'contactType',
      type: 'dropdown',
      label: 'Contact Type',
      required: true,
      options: [
        { value: 'phone', label: 'Phone' },
        { value: 'email', label: 'Email' },
        { value: 'address', label: 'Address' }
      ]
    },
    {
      name: 'phoneType',
      type: 'dropdown',
      label: 'Phone Type',
      required: true,
      condition: (rowData) => rowData.contactType === 'phone',
      options: [
        { value: 'mobile', label: 'Mobile' },
        { value: 'home', label: 'Home' },
        { value: 'work', label: 'Work' }
      ]
    },
    {
      name: 'phoneNumber',
      type: 'tel',
      label: 'Phone Number',
      required: true,
      condition: (rowData) => rowData.contactType === 'phone',
      placeholder: '+1 (555) 000-0000'
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      required: true,
      condition: (rowData) => rowData.contactType === 'email',
      placeholder: 'email@example.com'
    },
    {
      name: 'address',
      type: 'text',
      label: 'Address',
      required: true,
      condition: (rowData) => rowData.contactType === 'address',
      placeholder: 'Street address'
    },
    {
      name: 'isPrimary',
      type: 'checkbox',
      label: 'Primary Contact'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', {
      gradingSystems,
      notifications,
      contacts
    });
    // alert('Check console for form data!');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">DynamicFieldRows Component Demo</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Example 1: Grading Systems */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Example 1: Grading System Configuration
          </h2>
          <p className="text-gray-600 mb-4">
            This example shows conditional fields: select CGPA to see grade options, 
            or Numeric/Percentage to see minimum passing score.
          </p>
          <DynamicFieldRows
            fields={gradingFields}
            value={gradingSystems}
            onChange={setGradingSystems}
            addButtonText="Add Grading System"
            emptyMessage="No grading systems configured yet"
            maxRows={5}
          />
        </div>

        {/* Example 2: Notification Channels */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Example 2: Notification Channel Selection
          </h2>
          <p className="text-gray-600 mb-4">
            Configure notification types with multiple channel selection and priority levels.
          </p>
          <DynamicFieldRows
            fields={notificationFields}
            value={notifications}
            onChange={setNotifications}
            addButtonText="Add Notification Rule"
            emptyMessage="No notification rules configured"
            minRows={0}
          />
        </div>

        {/* Example 3: Contact Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Example 3: Contact Information
          </h2>
          <p className="text-gray-600 mb-4">
            Dynamic fields based on contact type selection - phone, email, or address.
          </p>
          <DynamicFieldRows
            fields={contactFields}
            value={contacts}
            onChange={setContacts}
            addButtonText="Add Contact"
            emptyMessage="No contacts added"
            showRemove={true}
            minRows={1}
            maxRows={10}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Submit Form
          </button>
        </div>
      </form>

      {/* Data Preview */}
      <div className="mt-8 bg-gray-100 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Current Form Data (Preview)</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Grading Systems:</h4>
            <pre className="bg-white p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(gradingSystems, null, 2)}
            </pre>
          </div>
          <div>
            <h4 className="font-medium mb-2">Notifications:</h4>
            <pre className="bg-white p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(notifications, null, 2)}
            </pre>
          </div>
          <div>
            <h4 className="font-medium mb-2">Contacts:</h4>
            <pre className="bg-white p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(contacts, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicFieldRowsDemo;
