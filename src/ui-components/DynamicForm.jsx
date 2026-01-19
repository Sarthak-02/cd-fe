import React from "react";
import TextField from "./TextField";
import Dropdown from "./Dropdown";
import Button from "./Button";
import CheckBox from "./CheckBox";
import DocumentUploader from "./DocumentUploader";
import TextArea from "./TextArea";
import { useTranslation } from "react-i18next";
import SearchableDropdown from "./SearchableDropdown";
import JsonView from "./JsonView";


function getResponsiveClasses(width = {}) {
  const mobile = width.mobile || 12;
  const tablet = width.tablet || mobile;
  const desktop = width.desktop || tablet;

  return `col-span-12 sm:col-span-${mobile} md:col-span-${tablet} lg:col-span-${desktop}`;
}

export default function DynamicForm({
  schema = [],
  formData = {},
  setFormData,
  handleSubmit,
  errors = {},
}) {

  const { t } = useTranslation();
  const handleChange = (field, value, ...extras) => {
    console.log("field", field);
    console.log("value", value);
    console.log("extras", extras);
    if (field.fn) {
      field.fn(value, ...extras);
    } else {
      setFormData((prev) => ({ ...prev, [field.id]: value }));
    }
  };

  const renderField = (field, error) => {
    const value = formData[field.id] ?? field.value;

    switch (field.type) {
      case "text":
      case "number":
      case "date":
      case "datetime-local":
      case "password":
        return (
          <TextField
            label={t(field.label)}
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
            // className="w-full p-2 border rounded-md text-sm"
            placeholder={field.label}
            variant={error ? "error" : field?.disabled ? "disabled" : "default"}
            // disabled={field.disabled}
            // width={field?.width || "w-full"}
          />
        );

      case "dropdown":
        return (
          <SearchableDropdown
            label={t(field.label)}
            options={
              typeof field.options === "function"
                ? field.options(formData)
                : field.options
            }
            multi={field.multiple ?? false}
            placeholder={field.label}
            onChange={(opt) => handleChange(field, opt,formData, setFormData)}
            selected={value}
            error={!!error}
            allowAdd={field.allowAdd ?? false}
            onAdd={(opt) => field?.onAdd ? field.onAdd(opt, formData, setFormData) : null}
            addLabel={field?.addLabel ?? "Add"}
            noResultsText={field?.noResultsText ?? "No results found"}
            renderOption={(opt) => <div>{opt?.label}</div>}
            maxHeight={field.maxHeight ?? "max-h-72"}
            showSelectAll={field.showSelectAll ?? true}
          />
        );

      case "checkbox":
        return (
          <CheckBox
            checked={value}
            onChange={(val) => handleChange(field, val)}
            title={t(field.name)}
            description={t(field.description)}
            disabled={field.disabled}
            error={!!error}
          />
        );
      case "image":
        return (
          <DocumentUploader
            label={t(field?.label)}
            accept={field?.accept}
            maxFiles={field?.maxFiles}
            maxSizeMB={field?.maxSize}
            imageConfig={field?.config}
            onChange={(file) =>
              handleChange(field, file, formData, setFormData)
            }
            url={value}
          />
        );
      case "textarea":
        return(
          <TextArea 
            label={t(field?.label)}
            value = {value}
            markdown={field?.markdown ?? false}
            onChange={(val) => handleChange(field,val)}
          />
        )
      case "button":
        return(
          <Button onClick={(value) => handleChange(field,value,formData,setFormData)}>
            {t(field?.label)}
          </Button>  
        )

      case "json":
        return (
          <JsonView
            value={value}
            onChange={(val) => handleChange(field, val)}
            height={field?.height ?? "h-96"}
          />
        );

      case "dynamic-rows":
        return (
          <DynamicFieldRows
            fields={field.dynamicRowsConfig?.fields || []}
            value={value || []}
            onChange={(newValue) => handleChange(field, newValue)}
            addButtonText={field.dynamicRowsConfig?.addButtonText || "Add"}
            showRemove={field.dynamicRowsConfig?.showRemove ?? true}
            minRows={field.dynamicRowsConfig?.minRows || 0}
            maxRows={field.dynamicRowsConfig?.maxRows || Infinity}
            emptyMessage={field.dynamicRowsConfig?.emptyMessage || "No items added yet"}
            formData={formData}
            setFormData={setFormData}
          />
        );

      default:
        return <div>Unsupported field type</div>;
    }
  };

  return (
    <div className="space-y-6">
      {schema?.length > 0 && schema?.map((section, i) => (
        <div key={i} className="space-y-4">
          {section.section_title && (
            <h3 className="text-lg font-semibold">{t(section.section_title)}</h3>
          )}

          <div className="grid grid-cols-12 gap-4">
            {section.fields.map((field) => (
              <div
                key={field.id}
                className={`${getResponsiveClasses(
                  field.width
                )} flex flex-col gap-1`}
                // className={`col-span-12 md:col-span-6 lg:col-span-4 flex flex-col gap-1`}
              >
                <label className="text-sm font-medium">
                  {t(field.name)}
                  {field.mandatory && <span className="text-red-500">*</span>}
                </label>

                {renderField(field, errors?.[field.id] || "")}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div
        className="
            fixed 
            bottom-0 left-0
            w-full 
            bg-white 
            shadow-[0_-2px_10px_rgba(0,0,0,0.1)] 
            p-2
        "
      >
        <div
          className="
                w-full 
                mx-auto 
                flex 
                md:justify-end 
                md:max-w-[400px]  /* limit width on desktop */
                md:mr-6           /* push it to the right */
                "
        >
          <Button className="w-full md:w-auto" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
