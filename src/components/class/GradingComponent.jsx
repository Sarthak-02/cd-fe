import React from 'react'

const gradingSystemRowFields = [
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
      id: 'campus_minPassingScore',
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
      id: 'campus_maxScore',
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
      id: 'campus_description',
      name: 'description',
      type: 'text',
      label: 'Description',
      placeholder: 'Optional description (e.g., "For grades 9-12")'
    }
  ];

function GradingComponent() {
  return (
    <div>GradingComponent</div>
  )
}

export default GradingComponent