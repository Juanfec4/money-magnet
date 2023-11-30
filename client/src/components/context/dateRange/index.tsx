import { FC, ReactNode, createContext, useContext, useState } from "react";

interface DateRangeContextProps {
  children: ReactNode;
}

interface DateRangeContextValues {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  setFromDate: (date: Date | undefined) => void;
  setToDate: (date: Date | undefined) => void;
}

const DateRangeContext = createContext<DateRangeContextValues | undefined>(
  undefined
);

export const DateRangeProvider: FC<DateRangeContextProps> = ({ children }) => {
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  );

  return (
    <DateRangeContext.Provider
      value={{ fromDate, toDate, setFromDate, setToDate }}
    >
      {children}
    </DateRangeContext.Provider>
  );
};

export const useDateRange = () => {
  const context = useContext(DateRangeContext);
  if (!context) {
    throw new Error("useDateRange must be used within a DateRangeProvider");
  }
  return context;
};
