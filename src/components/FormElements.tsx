import React from "react";

interface ButtonProps {
  type?: string | any;
  className: string;
  labelName?: string;
  buttonLabel?: string;
  disabled?: boolean;
}

export const Label: React.FC<ButtonProps> = ({ labelName, className }) => {
  return <span className={className}>{labelName}</span>;
};
export const inputClasses =
  "mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm";

export function FormField({
  label,
  required,
  children,
  className,
  labelClass,
}: any) {
  return (
    <div className={`flex flex-col  w-full mb-1 ${className} ${labelClass}`}>
      <div className="flex flex-row gap-1 items-center">
        <Label
          className="font-sans font-semibold text-gray-700 text-sm"
          labelName={label}
        />
        {required && <span className="text-red-500">*</span>}
      </div>
      {children}
    </div>
  );
}

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement>;

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ type = "text", className = "", defaultChecked = false, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={`${inputClasses} ${className}`}
        defaultChecked={defaultChecked}
        {...rest}
      />
    );
  }
);

export function SelectField({
  name,
  value,
  onChange,
  options,
  placeholder,
}: any) {
  return (
    <select
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputClasses} cursor-pointer`}
    >
      <option disabled value="">
        {placeholder}
      </option>
      {options.map((opt: any, index: any) => (
        <option key={index} value={opt} className="text-sm font-sans">
          {opt}
        </option>
      ))}
    </select>
  );
}

InputField.displayName = "InputField";
