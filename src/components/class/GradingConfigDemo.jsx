import React, { useState } from 'react';
import JsonView from '../../ui-components/JsonView';
import Button from '../../ui-components/Button';

/**
 * Demo component showing how to use JsonView for grading configuration
 * This is an example component - you can integrate the logic into your actual forms
 */
export default function GradingConfigDemo() {
  const [gradingConfig, setGradingConfig] = useState(null);
  const [savedConfig, setSavedConfig] = useState(null);

  // Example templates that users can quickly load
  const templates = {
    letter: {
      grading_system: "letter",
      passing_grade: "C",
      grades: [
        { letter: "A+", min: 97, max: 100, gpa: 4.0 },
        { letter: "A", min: 93, max: 96, gpa: 4.0 },
        { letter: "A-", min: 90, max: 92, gpa: 3.7 },
        { letter: "B+", min: 87, max: 89, gpa: 3.3 },
        { letter: "B", min: 83, max: 86, gpa: 3.0 },
        { letter: "C", min: 70, max: 82, gpa: 2.0 },
        { letter: "F", min: 0, max: 69, gpa: 0.0 }
      ]
    },
    cgpa: {
      grading_system: "cgpa",
      max_cgpa: 10.0,
      min_passing_cgpa: 5.0,
      scale: [
        { grade: "O", min_marks: 90, max_marks: 100, cgpa: 10 },
        { grade: "A+", min_marks: 80, max_marks: 89, cgpa: 9 },
        { grade: "A", min_marks: 70, max_marks: 79, cgpa: 8 },
        { grade: "B+", min_marks: 60, max_marks: 69, cgpa: 7 },
        { grade: "B", min_marks: 50, max_marks: 59, cgpa: 6 },
        { grade: "C", min_marks: 40, max_marks: 49, cgpa: 5 },
        { grade: "F", min_marks: 0, max_marks: 39, cgpa: 0 }
      ]
    },
    weighted: {
      grading_system: "weighted",
      components: [
        { name: "Assignments", weight: 20, count: 10, drop_lowest: 2 },
        { name: "Quizzes", weight: 15, count: 5, drop_lowest: 1 },
        { name: "Midterm Exam", weight: 25, count: 1 },
        { name: "Final Exam", weight: 30, count: 1 },
        { name: "Participation", weight: 10, subjective: true }
      ],
      total_weight: 100
    }
  };

  const loadTemplate = (templateKey) => {
    setGradingConfig(templates[templateKey]);
  };

  const handleSave = () => {
    if (gradingConfig) {
      setSavedConfig(gradingConfig);
      alert('Grading configuration saved successfully!');
      console.log('Saved config:', gradingConfig);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Grading Configuration Demo
        </h1>
        <p className="text-gray-600">
          Use the JSON editor below to configure your class grading system. 
          You can load templates or create your own custom configuration.
        </p>
      </div>

      {/* Template Buttons */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-3">Quick Templates</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => loadTemplate('letter')}
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-md hover:bg-blue-100 transition-colors"
          >
            Letter Grade (A-F)
          </button>
          <button
            onClick={() => loadTemplate('cgpa')}
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-md hover:bg-blue-100 transition-colors"
          >
            CGPA System (0-10)
          </button>
          <button
            onClick={() => loadTemplate('weighted')}
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-md hover:bg-blue-100 transition-colors"
          >
            Weighted Components
          </button>
        </div>
      </div>

      {/* JSON Editor */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Grading Configuration JSON
        </h3>
        <JsonView
          label="Grading Configuration"
          value={gradingConfig}
          onChange={setGradingConfig}
          placeholder="Load a template above or enter your custom grading configuration..."
          height="h-96"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleSave}>
          Save Configuration
        </Button>
        <button
          onClick={() => setGradingConfig(null)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Display Saved Config */}
      {savedConfig && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3">
            Last Saved Configuration
          </h3>
          <div className="bg-white rounded-md p-4 border border-green-300">
            <JsonView
              value={savedConfig}
              onChange={() => {}}
              readOnly={true}
              height="h-64"
            />
          </div>
        </div>
      )}

      {/* Current Value Display */}
      {gradingConfig && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Parsed Configuration (JavaScript Object)
          </h3>
          <div className="bg-white rounded-md p-4 border border-gray-300 overflow-x-auto">
            <pre className="text-xs text-gray-800">
              {JSON.stringify(gradingConfig, null, 2)}
            </pre>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Grading System Type:</strong> {gradingConfig.grading_system || 'Not specified'}</p>
            {gradingConfig.grading_system === 'letter' && (
              <p><strong>Number of Grades:</strong> {gradingConfig.grades?.length || 0}</p>
            )}
            {gradingConfig.grading_system === 'cgpa' && (
              <p><strong>Max CGPA:</strong> {gradingConfig.max_cgpa || 'Not specified'}</p>
            )}
            {gradingConfig.grading_system === 'weighted' && (
              <p><strong>Number of Components:</strong> {gradingConfig.components?.length || 0}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
