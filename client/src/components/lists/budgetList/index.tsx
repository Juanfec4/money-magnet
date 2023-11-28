import { FC } from "react";
import { Budget } from "../../../types/global";
import BudgetCard from "../../cards/budgetCard";
import NoResultsCard from "../../alerts/noResults";

//Define prop structure
interface BudgetListProps {
  budgets: Budget[];
}

const BudgetList: FC<BudgetListProps> = ({ budgets }) => {
  //No budgets found
  if (budgets.length == 0) return <NoResultsCard message="No budgets found" />;

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-6 h-84  content-center overflow-y-scroll">
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
