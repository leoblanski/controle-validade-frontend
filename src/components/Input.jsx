
/*
  * This file is part of the "MyApp" project.
  *
  * @param {string} label - The label for the input field.
  * @param {string} type - The type of the input field (default is "text").
  * @param {string} name - The name of the input field.
  * @param {string} id - The id of the input field.
  * @param {string} value - The value of the input field.
  * @param {function} onChange - The function to call when the input value changes.
  * @param {boolean} required - Whether the input field is required (default is false).
  * @param {object} props - Additional props to pass to the input field.
  * 
  * @returns {JSX.Element} The rendered input component.
*/
export default function Input({
  label,
  type = "text",
  name,
  id,
  value,
  onChange,
  required = false,
  ...props
}) {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor="category" className="mb-1 font-medium">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        type={type}
        name={name}
        id={id}
        value={value}
        className="border rounded-lg px-3 py-2 w-full shadow-sm focus:ring focus:ring-gray-300"
        onChange={onChange}
        required={required}
        {...props}
      />
    </div>
  );
}