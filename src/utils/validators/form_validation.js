export const validateField = (field, value) => {
    // Required
    if (field.mandatory && !value) {
      return `${field.label || field.name} is required`;
    }

    // Regex
    if (field.regex) {
      const regex = new RegExp(field.regex);
      if (!regex.test(value)) return field.errorMessage || "Invalid value";
    }

    // Min length
    if (field.minLength && value?.length < field.minLength) {
      return `${field.label} must be at least ${field.minLength} characters`;
    }

    // Max length
    if (field.maxLength && value?.length > field.maxLength) {
      return `${field.label} cannot exceed ${field.maxLength} characters`;
    }

    return "";
  };

  export const validateForm = (schema,formData) => {
    let newErrors = {};

    schema.forEach((section) => {
      section.fields.forEach((field) => {
        const value = formData[field.id];
        const error = validateField(field, value);
        if (error) newErrors[field.id] = error;
      });
    });

    return {errors:newErrors, isError:Object.keys(newErrors).length !== 0};
  };