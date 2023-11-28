import { ChangeEvent, FC } from "react";

//Define prop structure
interface TextInputProps {
  placeholder?: string;
  label?: string;
  id: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
const TextInput: FC<TextInputProps> = ({
  placeholder,
  label,
  id,
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col space-y-1 text-slate-200">
      <label htmlFor={id} className="font-bold">
        {label}
      </label>
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        name={id}
        value={value}
        onChange={onChange}
        className="border-[1px] p-2 rounded-md w-full md:w-64 placeholder:text-sm outline-none focus:border-lime-500 bg-gray-500/10 border-gray-500"
      />
    </div>
  );
};
export default TextInput;
