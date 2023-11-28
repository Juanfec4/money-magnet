import { useEffect, useState } from "react";

//Define custom hook options
interface UseSearchOptions<T> {
  filterFn: (item: T) => boolean;
  data: T[];
}

const useSearch = <T>({ filterFn, data }: UseSearchOptions<T>) => {
  //States
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  //Handle filter change
  useEffect(() => {
    setFilteredData(() => (searchTerm ? data.filter(filterFn) : data));
  }, [data, searchTerm]);

  //Change search term
  const handleSearchChange = (value: string) => {
    setSearchTerm(() => value);
  };

  return {
    searchTerm,
    filteredData,
    handleSearchChange,
  };
};

export default useSearch;
