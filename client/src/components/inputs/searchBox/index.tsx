import { ChangeEvent, FC } from "react";
import { IconSearch } from "@tabler/icons-react";

//Define prop structure
export interface SearchBoxProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchBox: FC<SearchBoxProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-row border-[1px] p-2 rounded-md  w-full md:w-64 focus-within:border-lime-500 bg-gray-500/10 border-gray-500 gap-2">
      <IconSearch className="hidden sm:block" />
      <input
        type="text"
        placeholder="Search"
        value={value}
        onChange={onChange}
        className="placeholder:text-sm outline-none bg-transparent"
      />
    </div>
  );
};
export default SearchBox;
