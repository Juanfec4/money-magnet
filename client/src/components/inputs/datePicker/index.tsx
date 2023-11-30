import { FC, useState } from "react";
import Calendar from "../../ui/calendar";

interface DatePickerProps {
  id: string;
  label?: string;
  selectedDate: Date | undefined;
  changeFn: (date: Date | undefined) => void;
}
const DatePicker: FC<DatePickerProps> = ({
  id,
  label,
  selectedDate,
  changeFn,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const toggleCalendar = () => {
    setShowCalendar((prev) => !prev);
  };

  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={id} className="font-bold text-sm">
          {label}
        </label>
      )}
      <input
        id={id}
        type="text"
        className=" text-white border-[1px] bg-gray-500/10 border-gray-500 px-4 py-2 rounded-md focus:outline-none focus:border-lime-500 text-center w-36"
        placeholder="Select a date"
        value={selectedDate ? selectedDate.toLocaleDateString("en-GB") : ""}
        readOnly
        onClick={toggleCalendar}
      />
      {showCalendar && (
        <div
          className="absolute mt-2 bg-gray-800 border border-gray-700 rounded-md p-2 w-80"
          onMouseLeave={() => setShowCalendar(false)}
        >
          <Calendar
            selectedDate={selectedDate}
            onDateChange={(date) => {
              changeFn(date);
              setShowCalendar(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
