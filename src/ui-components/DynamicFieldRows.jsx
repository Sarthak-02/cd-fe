import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TextField from './TextField';
import Dropdown from './Dropdown';
import SearchableDropdown from './SearchableDropdown';
import CheckBox from './CheckBox';
import Button from './Button';

/**
 * DynamicFieldRows - A generic component for handling multiple rows of form fields
 * with conditional field rendering and validation
 * 
 * @param {Object} props
 * @param {Array} props.fields - Array of field configurations
 * @param {Array} props.value - Array of row data objects
 * @param {Function} props.onChange - Callback when rows change
 * @param {String} props.addButtonText - Text for add button (default: "Add")
 * @param {Boolean} props.showRemove - Whether to show remove button for rows (default: true)
 * @param {Number} props.minRows - Minimum number of rows to show (default: 0)
 * @param {Number} props.maxRows - Maximum number of rows allowed (default: unlimited)
 * @param {String} props.emptyMessage - Message to show when no rows exist
 */
const DynamicFieldRows = ({
  fields = [],
  value = [],
  onChange,
  addButtonText = 'Add',
  showRemove = true,
  minRows = 0,
  maxRows = Infinity,
  emptyMessage = 'No items added yet',
  formData = {},
  setFormData = () => {}
}) => {
  const [rows, setRows] = useState(value.length > 0 ? value : []);
  const [currentRow, setCurrentRow] = useState({});
  const [dynamicOptions, setDynamicOptions] = useState({});
  console.log("fields", fields);
  useEffect(() => {
    setRows(value);
  }, [value]);

  // Get visible fields for a row based on conditions
  const getVisibleFields = (rowData) => {
    return fields.filter(field => {
      if (!field.condition) return true;
      return field.condition(rowData);
    });
  };

  // Check if a field is required and visible
  const isFieldRequired = (field, rowData) => {
    const isVisible = !field.condition || field.condition(rowData);
    return field.required && isVisible;
  };

  // Validate if current row is complete
  const isCurrentRowValid = () => {
    const visibleFields = getVisibleFields(currentRow);
    
    return visibleFields.every(field => {
      if (!isFieldRequired(field, currentRow)) return true;
      
      const value = currentRow[field.name];
      
      // Check if value exists and is not empty
      if (value === undefined || value === null || value === '') return false;
      
      // For arrays (multi-select), check if not empty
      if (Array.isArray(value) && value.length === 0) return false;
      
      // Custom validation if provided
      if (field.validate) {
        return field.validate(value, currentRow);
      }
      
      return true;
    });
  };

  // Handle field change in current row
  const handleFieldChange = (fieldId, newValue) => {
    const updatedRow = { ...currentRow, [fieldId]: newValue };
    
    // Clear dependent fields if a condition-triggering field changes
    const clearedRow = { ...updatedRow };
    fields.forEach(field => {
      if (field.condition && !field.condition(updatedRow) && clearedRow[field.id]) {
        delete clearedRow[field.id];
      }
    });
    
    setCurrentRow(clearedRow);
  };

  // Handle field change in existing row
  const handleExistingRowChange = (index, fieldId, newValue) => {
    const updatedRows = [...rows];
    const updatedRow = { ...updatedRows[index], [fieldId]: newValue };
    
    // Clear dependent fields
    const clearedRow = { ...updatedRow };
    fields.forEach(field => {
      if (field.condition && !field.condition(updatedRow) && clearedRow[field.id]) {
        delete clearedRow[field.id];
      }
    });
    
    updatedRows[index] = clearedRow;
    setRows(updatedRows);
    onChange?.(updatedRows);
  };

  // Add current row to rows array
  const handleAddRow = () => {
    if (!isCurrentRowValid()) return;
    if (rows.length >= maxRows) return;
    
    const newRows = [...rows, currentRow];
    setRows(newRows);
    setCurrentRow({});
    onChange?.(newRows);
  };

  // Remove a row
  const handleRemoveRow = (index) => {
    if (rows.length <= minRows) return;
    
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
    onChange?.(newRows);
  };

  // Render a single field
  const renderField = (field, rowData, isCurrentRow, rowIndex = null) => {
    const value = rowData[field.name] || '';
    const handleChange = isCurrentRow
      ? (newValue) => handleFieldChange(field.id, newValue)
      : (newValue) => handleExistingRowChange(rowIndex, field.id, newValue);

    // Get options - merge base options with dynamic options for this field
    const getFieldOptions = () => {
      const baseOptions = typeof field.options === 'function' ? field.options(rowData) : field.options;
      const fieldDynamicOptions = dynamicOptions[field.name] || [];
      return [...baseOptions, ...fieldDynamicOptions];
    };

    // Handle adding new options for searchable dropdowns
    const handleAddOption = (label) => {
      const newOption = {
        value: label.toLowerCase().replace(/\s+/g, '_'),
        label: label
      };
      
      setDynamicOptions(prev => ({
        ...prev,
        [field.name]: [...(prev[field.name] || []), newOption]
      }));
      
      // Automatically select the newly added option
      handleChange(newOption.value);
      
      // Call custom onAdd if provided
      if (field.onAdd) {
        field.onAdd(newOption);
      }
    };

    const commonProps = {
      label: field.label,
      value: value,
      placeholder: field.placeholder,
      disabled: field.disabled,
      required: isFieldRequired(field, rowData),
      error: field.error,
      allowAdd: field.allowAdd ?? false,
      onAdd: field.allowAdd ? field?.onAdd ? (opt) => field?.onAdd(opt,formData,setFormData) : null : (field.onAdd ?? (() => {})),
      addLabel: field.addLabel ?? "Add",
      noResultsText: field.noResultsText ?? "No results found",
      renderOption: field.renderOption ?? null,
      maxHeight: field.maxHeight ?? "max-h-72",
      showSelectAll: field.showSelectAll ?? true,
    };

    switch (field.type) {
      case 'text':
      case 'number':
      case 'email':
      case 'tel':
        return (
          <TextField
            key={field.name}
            {...commonProps}
            type={field.type}
            onChange={(e) => handleChange(e.target.value)}
          />
        );

      case 'dropdown':
        return (
          <Dropdown
            key={field.name}
            {...commonProps}
            options={getFieldOptions()}
            onChange={handleChange}
          />
        );

      case 'searchable-dropdown':
        return (
          <SearchableDropdown
            key={field.name}
            {...commonProps}
            options={getFieldOptions()}
            onChange={handleChange}
          />
        );

      case 'checkbox':
        return (
          <CheckBox
            key={field.name}
            {...commonProps}
            checked={!!value}
            onChange={(e) => handleChange(e.target.checked)}
          />
        );

      case 'multi-select':
        return (
          <div key={field.name} className="multi-select-wrapper">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {isFieldRequired(field, rowData) && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex flex-wrap gap-2">
              {getFieldOptions().map(option => (
                <label key={option.value} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={Array.isArray(value) && value.includes(option.value)}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      const newValues = e.target.checked
                        ? [...currentValues, option.value]
                        : currentValues.filter(v => v !== option.value);
                      handleChange(newValues);
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'custom':
        return field.render ? field.render(value, handleChange, rowData) : null;

      default:
        return null;
    }
  };

  return (
    <div className="dynamic-field-rows space-y-4">
      {/* Existing Rows */}
      {rows.length > 0 ? (
        <div className="space-y-3">
          {rows.map((row, index) => {
            const visibleFields = getVisibleFields(row);
            return (
              <div key={index} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {visibleFields.map(field => (
                    <div key={field.name}>
                      {renderField(field, row, false, index)}
                    </div>
                  ))}
                </div>
                {showRemove && rows.length > minRows && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(index)}
                    className="mt-6 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                    title="Remove"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
          {emptyMessage}
        </div>
      )}

      {/* Current Row (Add New) */}
      {rows.length < maxRows && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {getVisibleFields(currentRow).map(field => (
              <div key={field.name}>
                {renderField(field, currentRow, true)}
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleAddRow}
              disabled={!isCurrentRowValid()}
              className="px-6 py-2"
            >
              {addButtonText}
            </Button>
          </div>
        </div>
      )}

      {/* Max rows reached message */}
      {rows.length >= maxRows && maxRows < Infinity && (
        <div className="text-center text-sm text-gray-500">
          Maximum {maxRows} {maxRows === 1 ? 'item' : 'items'} reached
        </div>
      )}
    </div>
  );
};

DynamicFieldRows.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['text', 'number', 'email', 'tel', 'dropdown', 'searchable-dropdown', 'checkbox', 'multi-select', 'custom']).isRequired,
      label: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      required: PropTypes.bool,
      disabled: PropTypes.bool,
      options: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
      condition: PropTypes.func,
      validate: PropTypes.func,
      render: PropTypes.func,
    })
  ).isRequired,
  value: PropTypes.array,
  onChange: PropTypes.func,
  addButtonText: PropTypes.string,
  showRemove: PropTypes.bool,
  minRows: PropTypes.number,
  maxRows: PropTypes.number,
  emptyMessage: PropTypes.string,
};

export default DynamicFieldRows;
