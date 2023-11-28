import { FC } from "react";

//Define prop structure
interface TextInputProps {
  placeholder?: string;
  label?: string;
}
const TextInput: FC<TextInputProps> = ({ placeholder, label }) => {
  return (
    <div className="p-2 flex flex-col space-y-1">
      <label htmlFor="" className="font-bold">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        className="border-[1px] p-2 rounded-md w-64 placeholder:text-sm outline-none focus:border-lime-500 bg-gray-700 border-gray-500"
      />
    </div>
  );
};
export default TextInput;
