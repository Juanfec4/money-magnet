import { FC, ReactNode } from "react";

//Define prop structure
interface BudgetContainerProps {
  children?: ReactNode;
}

const BudgetContainer: FC<BudgetContainerProps> = ({ children }) => {
  return (
    <div>
      <h3 className="text-2xl mb-3 pl-2 border-l border-lime-500 text-slate-200">
        Budget
      </h3>
      <div className="border-2 border-gray-700 rounded-md my-8 px-2 py-6 flex flex-col gap-5 h-[600px] overflow-y-scroll">
        {children}
      </div>
    </div>
  );
};

export default BudgetContainer;
