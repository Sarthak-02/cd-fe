/**
 * Updates multiple fields in a schema based on a map of fieldId → updateData.
 *
 * Each entry in `updatesMap` corresponds to a field ID and contains the
 * partial properties that should be merged into that field.
 *
 * Example:
 *   updateSchema(schema, {
 *     username: { required: true },
 *     email: { label: "Email Address" }
 *   });
 *
 * @param {Array} schema - Original schema array containing sections with fields.
 * @param {Object} updatesMap - An object where keys are field IDs and values are update objects.
 * @returns {Array} A new schema array with updated fields.
 */
export const updateSchema = (schema, updatesMap) => {
  return schema.map(section => ({
    ...section,
    fields: section.fields.map(field => {
      if (updatesMap[field.id]) {
        return { ...field, ...updatesMap[field.id] };
      }
      return field;
    })
  }));
};


export function createFullName(firstname , middlename,lastname){
  return [firstname,middlename,lastname].filter(Boolean).join(" ")
}

export const getFieldValuesMap = (schema) => {
  return schema.reduce((acc, section) => {
    section.fields.forEach(field => {
      if (field.type === 'dynamic-rows' && field.dynamicRowsConfig?.fields) {
        
        // Create a separate key with extracted field values for external use
        const dynamicRowsData = {};
        field.dynamicRowsConfig.fields.forEach(rowField => {
          const fieldKey = rowField.id || rowField.name;
          // Extract values from the rows array if they exist
          if (Array.isArray(field.value)) {
            dynamicRowsData[fieldKey] = field.value.map(row => row[fieldKey]);
          }
        });
        
        // Store the extracted data under a separate key for easy access
        acc[field.id] = dynamicRowsData;
      } else {
        acc[field.id] = field.value;
      }
    });
    return acc;
  }, {});
};
