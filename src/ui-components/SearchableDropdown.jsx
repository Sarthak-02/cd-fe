import React, { useState, useRef, useEffect } from "react";
import { Search, Plus, X, Check, ChevronDown, CheckSquare, Square } from "lucide-react";

/**
 * SearchableDropdown - A reusable dropdown component with search and add functionality
 * 
 * @param {Object} props
 * @param {string} props.label - Label for the dropdown
 * @param {Array} props.options - Array of options { label: string, value: any, ...customFields }
 * @param {boolean} props.multi - Enable multi-select mode
 * @param {string} props.placeholder - Placeholder text
 * @param {any} props.selected - Selected value(s) - single value or array for multi-select
 * @param {Function} props.onChange - Callback when selection changes
 * @param {string} props.width - Width class (default: "w-full")
 * @param {boolean} props.error - Show error state
 * @param {string} props.errorMessage - Error message to display
 * @param {boolean} props.disabled - Disable the dropdown
 * @param {boolean} props.searchable - Enable/disable search (default: true)
 * @param {boolean} props.allowAdd - Enable "Add New" option (default: false)
 * @param {Function} props.onAdd - Callback when adding new item (searchQuery) => void
 * @param {string} props.addLabel - Custom label for add button (default: "Add")
 * @param {string} props.noResultsText - Text when no results found
 * @param {Function} props.renderOption - Custom render function for options
 * @param {number} props.maxHeight - Max height of dropdown (default: 288px)
 * @param {boolean} props.showSelectAll - Show "Select All" option for multi-select (default: true)
 */
export default function SearchableDropdown({
  label,
  options = [],
  multi = false,
  placeholder = "Select...",
  selected,
  onChange,
  width = "w-full",
  error = false,
  errorMessage = "",
  disabled = false,
  searchable = true,
  allowAdd = false,
  onAdd = null,
  addLabel = "Add",
  noResultsText = "No results found",
  renderOption = null,
  maxHeight = "max-h-72",
  showSelectAll = true,
}) {
  
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    if (multi) {
      if (selected?.includes(option.value)) {
        onChange(selected.filter((v) => v !== option.value));
      } else {
        onChange([...(selected || []), option.value]);
      }
    } else {
      onChange(option.value);
      setOpen(false);
      setSearchQuery("");
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(multi ? [] : "");
    setSearchQuery("");
  };

  const handleAddNew = () => {
    if (onAdd && searchQuery.trim()) {
      onAdd(searchQuery.trim());
      setSearchQuery("");
      if (!multi) {
        setOpen(false);
      }
    }
  };

  // Filter options based on search query
  const filteredOptions = searchable && searchQuery
    ? options.filter((o) =>
        o.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const handleSelectAll = () => {
    const allValues = filteredOptions.map(opt => opt.value);
    onChange(allValues);
  };

  const handleDeselectAll = () => {
    onChange([]);
  };

  const isAllSelected = multi && filteredOptions.length > 0 && 
    filteredOptions.every(opt => selected?.includes(opt.value));

  const isSomeSelected = multi && selected?.length > 0 && !isAllSelected;

  const renderLabel = () => {
    if (multi) {
      if (!selected?.length) return placeholder;
      const selectedOptions = options.filter((o) => selected.includes(o.value));
      if (selectedOptions.length === 0) return placeholder;
      if (selectedOptions.length === 1) return selectedOptions[0].label;
      return `${selectedOptions.length} selected`;
    }

    const option = options.find((o) => o.value === selected);
    return option ? option.label : placeholder;
  };

  const showAddOption = 
    allowAdd && 
    onAdd && 
    searchQuery.trim() && 
    !filteredOptions.some(opt => 
      opt.label.toLowerCase() === searchQuery.toLowerCase()
    );

  const hasSelection = multi ? selected?.length > 0 : selected;

  return (
    <div className={`${width} relative`} ref={ref}>
      {/* Label */}
      {label && (
        <label className="block mb-1.5 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            if (!disabled) {
              setOpen((prev) => !prev);
              if (!open) {
                setSearchQuery("");
              }
            }
          }}
          className={`
            w-full border rounded-lg px-3 py-2.5 text-left 
            flex justify-between items-center gap-2
            transition-all duration-200
            ${error 
              ? "border-red-500 focus:ring-2 focus:ring-red-200" 
              : "border-gray-300 focus:ring-2 focus:ring-blue-200"
            }
            ${disabled 
              ? "bg-gray-100 cursor-not-allowed text-gray-400" 
              : "bg-white hover:border-gray-400 cursor-pointer"
            }
            ${open ? "ring-2 ring-blue-200 border-blue-400" : ""}
          `}
        >
          <span className={`flex-1 truncate ${!hasSelection ? "text-gray-400" : "text-gray-800"}`}>
            {renderLabel()}
          </span>
          
          <div className="flex items-center gap-1">
            {hasSelection && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-0.5 hover:bg-gray-200 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
            <ChevronDown 
              className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} 
            />
          </div>
        </button>
      </div>

      {/* Error Message */}
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}

      {/* Dropdown List */}
      {open && !disabled && (
        <div 
          className={`
            absolute z-50 mt-2 w-full bg-white shadow-xl border border-gray-200 
            rounded-lg ${maxHeight} overflow-hidden flex flex-col
          `}
        >
          {/* Search Bar */}
          {searchable && (
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                    text-sm"
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="overflow-y-auto flex-1">
            {/* Select All Option (Multi-select only) */}
            {multi && showSelectAll && filteredOptions.length > 0 && (
              <div
                onClick={isAllSelected ? handleDeselectAll : handleSelectAll}
                className="px-3 py-2.5 cursor-pointer flex items-center gap-2 
                  hover:bg-gray-50 border-b border-gray-200 sticky top-0 bg-white z-10
                  transition-colors font-medium text-gray-700"
              >
                {isAllSelected ? (
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                ) : isSomeSelected ? (
                  <div className="w-4 h-4 border-2 border-blue-600 rounded flex items-center justify-center">
                    <div className="w-2 h-0.5 bg-blue-600" />
                  </div>
                ) : (
                  <Square className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-sm">
                  {isAllSelected ? "Deselect All" : "Select All"}
                  {filteredOptions.length < options.length && searchQuery && (
                    <span className="text-gray-500 font-normal ml-1">
                      ({filteredOptions.length})
                    </span>
                  )}
                </span>
              </div>
            )}

            {/* Add New Option */}
            {showAddOption && (
              <div
                onClick={handleAddNew}
                className="px-3 py-2.5 cursor-pointer flex items-center gap-2 
                  hover:bg-blue-50 border-b border-gray-200 text-blue-600 font-medium
                  transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">
                  {addLabel} "{searchQuery}"
                </span>
              </div>
            )}

            {/* Options */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, index) => {
                const active = multi
                  ? selected?.includes(opt.value)
                  : selected === opt.value;

                return (
                  <div
                    key={opt.value ?? index}
                    onClick={() => handleSelect(opt)}
                    className={`
                      px-3 py-2.5 cursor-pointer flex items-center justify-between gap-2
                      transition-colors
                      ${active 
                        ? "bg-blue-50 text-blue-700" 
                        : "hover:bg-gray-50 text-gray-800"
                      }
                    `}
                  >
                    {renderOption ? (
                      renderOption(opt, active)
                    ) : (
                      <>
                        <span className="flex-1 text-sm">{opt.label}</span>
                        {active && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                      </>
                    )}
                  </div>
                );
              })
            ) : !showAddOption ? (
              <div className="px-3 py-8 text-center text-gray-500 text-sm">
                {noResultsText}
              </div>
            ) : null}
          </div>

          {/* Multi-select footer */}
          {multi && selected?.length > 0 && (
            <div className="p-2 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <span className="text-xs text-gray-600">
                {selected.length} item{selected.length !== 1 ? "s" : ""} selected
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 
                  rounded transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
