import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";
import { FC, useState } from "react";

interface CalendarProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

const Calendar: FC<CalendarProps> = ({ selectedDate, onDateChange }) => {
  const [currentDate, setCurrentDate] = useState<Date>(
    selectedDate || new Date()
  );

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const daysArray = Array.from(
    { length: daysInMonth },
    (_, index) => index + 1
  );

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(day);
    onDateChange(newDate);
  };

  const handleMonthChange = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(currentDate);
    const year = parseInt(event.target.value, 10);
    if (!isNaN(year)) {
      newDate.setFullYear(year);
      setCurrentDate(newDate);
    }
  };

  return (
    <div className="grid grid-rows-[auto,auto,1fr]">
      <div className="flex justify-between mb-2">
        <button onClick={() => handleMonthChange(-1)}>
          <IconArrowNarrowLeft />
        </button>
        <div className="flex items-center">
          <div className="text-lime-500 font-bold">
            {currentDate.toLocaleString("default", { month: "long" })}{" "}
          </div>
          <input
            type="text"
            className="ml-2 p-1 border border-gray-500 w-16 text-center bg-transparent outline-none rounded-md"
            value={currentDate.getFullYear()}
            onChange={handleYearChange}
          />
        </div>
        <button onClick={() => handleMonthChange(1)}>
          <IconArrowNarrowRight />
        </button>
      </div>
      <div className="grid grid-cols-7">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-white text-center">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {daysArray.map((day) => (
          <div
            key={day}
            className={`text-center cursor-pointer px-2 my-1 py-1 ${
              selectedDate?.getDate() === day &&
              "bg-lime-500 text-gray-900 rounded-md"
            }`}
            onClick={() => handleDateClick(day)}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
