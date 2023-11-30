import { IconSquareRoundedChevronDown } from "@tabler/icons-react";
import { FC, useState } from "react";
interface SelectInputProps {
  options: string[];
  selected?: string;
  changeFn: (option: string) => void;
  label?: string;
}

const SelectInput: FC<SelectInputProps> = ({
  options,
  selected,
  changeFn,
  label,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleOptionClick = (option: string) => {
    changeFn(option);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="flex flex-col gap-1 w-full md:w-64">
      <label htmlFor="custom-select" className="font-bold">
        {label}
      </label>
      <div className="relative inline-block" id="custom-select">
        <div
          className="selected-option cursor-pointer capitalize border-[1px] p-2 rounded-md placeholder:text-sm outline-none focus:border-lime-500 bg-gray-500/10 border-gray-500"
          onClick={toggleDropdown}
        >
          <p>{selected || "Select an option"}</p>
          <IconSquareRoundedChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-lime-500 transition duration-200" />
        </div>
        {isDropdownOpen && (
          <div className="dropdown-menu absolute top-full left-0 w-full bg-gray-900 border border-t-0 border-gray-500 rounded">
            {options.map((option) => {
              if (selected === option) return null;
              return (
                <div
                  key={option}
                  className="option cursor-pointer p-2 transition duration-200 hover:bg-slate-600 capitalize"
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectInput;
