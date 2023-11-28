import { FC } from "react";
import { Budget } from "../../../types/global";
import BudgetCard from "../../cards/budgetCard";

//Define prop structure
interface BudgetListProps {
  budgets: Budget[];
}

const BudgetList: FC<BudgetListProps> = ({ budgets }) => {
  return (
    <ul className="flex gap-4 flex-wrap h-84 overflow-y-scroll">
      {budgets.map((budget: Budget) => {
        return (
          <li key={budget.id}>
            <BudgetCard name={budget.name} unique_code={budget.unique_code} />
          </li>
        );
      })}
    </ul>
  );
};
export default BudgetList;
