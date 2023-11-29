import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useParams } from "react-router-dom";
import BudgetContainer from "../../../components/containers/budget";
import SectionContainer from "../../../components/containers/section";
import AccountGroup from "../../../components/dataDisplay/accountGroup";
import BudgetMembersList from "../../../components/lists/budgetMemberList";
import FeaturedText from "../../../components/ui/featuredText";
import { Budget } from "../../../types/global";
import api from "../../../utilities/api";

const BudgetPage: FC = () => {
  //Get budget id
  const { id } = useParams();

  //Fetch budget info
  const budgetInfoQuery = useQuery({
    queryKey: ["budgetInfo", id],
    queryFn: () => api.fetchData(`/budgets/${id}`),
  });

  if (budgetInfoQuery.isLoading) return null;

  const budget = budgetInfoQuery.data as Budget;

  return (
    <div>
      <SectionContainer
        title={budget.name}
        titleLink={{ onClick: () => "", text: "Edit" }}
      >
        <div className="-mt-8 mb-4 mx-auto max-w-max md:mx-0">
          <FeaturedText text={budget.unique_code} />
        </div>
        <BudgetContainer>
          <AccountGroup type="income" name="Income" budgetId={budget.id} />
          <AccountGroup type="expense" name="Expenses" budgetId={budget.id} />
          <AccountGroup type="saving" name="Savings" budgetId={budget.id} />
          <AccountGroup
            type="investment"
            name="Investments"
            budgetId={budget.id}
          />
        </BudgetContainer>
        <BudgetMembersList members={budget.members} />
      </SectionContainer>
    </div>
  );
};
export default BudgetPage;
