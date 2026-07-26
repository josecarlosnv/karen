import Select, { StylesConfig } from "react-select";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
   onScrollBottom?: () => void;//by isaac para paginacion
  placeholder?: string;
  className?: string;
  isDisabled?: boolean;
}

export function SearchableSelect({
  id,
  value,
  onChange,
  options,
    onScrollBottom,//para paginacions
  placeholder = "Select...",
  className = "",
  isDisabled = false,
}: SearchableSelectProps) {

  const selectedOption =
    options.find((opt) => opt.value === value) || null;

  const customStyles: StylesConfig<Option, false> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "36px",
      borderRadius: "8px",
      fontSize: "0.875rem",

      borderColor: state.isFocused ? "#1E49E2" : "#D6DFEE",
      backgroundColor: isDisabled ? "#F9FAFB" : "#FFFFFF",

      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(30, 73, 226, 0.15)"
        : "none",

      transition: "all 0.15s ease",

      "&:hover": {
        borderColor: "#1E49E2",
        backgroundColor: "#F7FAFF",
      },
    }),

    singleValue: (provided) => ({
      ...provided,
      color: "#1F2937",
      fontSize: "11px",
      fontWeight: 400,
    }),

    placeholder: (provided) => ({
      ...provided,
      color: "#9AA8C7",
      fontSize: "0.875rem",
    }),

    input: (provided) => ({
      ...provided,
      fontSize: "0.875rem",
      color: "#1F2937",
    }),

    menu: (provided) => ({
      ...provided,
      borderRadius: "10px",
      overflow: "hidden",
      border: "1px solid #E4ECFF",
      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      zIndex: 99999,
    }),

    menuPortal: (provided) => ({
      ...provided,
      zIndex: 99999,
    }),

    menuList: (provided) => ({
      ...provided,
      padding: "4px",
      maxHeight: "260px",
    }),

    option: (provided, state) => ({
      ...provided,
      fontSize: "0.875rem",
      borderRadius: "6px",
      padding: "8px 10px",
      cursor: "pointer",
      transition: "all 0.12s ease",

      backgroundColor: state.isSelected
        ? "#00338D"
        : state.isFocused
        ? "#A5B6F3"
        : "transparent",

      color: state.isSelected ? "#FFFFFF" : "#1F2937",

      "&:active": {
        backgroundColor: "#1E49E2",
        color: "#FFFFFF",
      },
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),

    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused ? "#1E49E2" : "#9AA8C7",
      padding: "4px",

      "&:hover": {
        color: "#1E49E2",
      },
    }),

    clearIndicator: (provided) => ({
      ...provided,
      padding: "4px",
      color: "#9AA8C7",

      "&:hover": {
        color: "#1E49E2",
      },
    }),
  };

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <Select
        inputId={id}
        value={selectedOption}
        onChange={(option) => onChange(option?.value || "")}
        options={options}
        onMenuScrollToBottom={onScrollBottom}//para la paginacion de entidades
        placeholder={placeholder}
        styles={customStyles}
        className={className}
        classNamePrefix="react-select"  // ✅ BONUS
        isDisabled={isDisabled}
        isClearable
        isSearchable
        menuPortalTarget={document.body}
        menuPosition="fixed"
        menuPlacement="auto"
      />
    </div>
  );
}
