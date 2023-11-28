import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../utilities/api";
import BudgetList from "../../../components/lists/budgetList";
import Loader from "../../../components/ui/loader";
import SectionContainer from "../../../components/containers/section";
import FormContainer from "../../../components/containers/form";
import TextInput from "../../../components/inputs/textInput";

//Dashboard page
const DashboardPage: FC = () => {
  const budgetsQuery = useQuery({
    queryKey: ["budgets"],
    queryFn: () => api.fetchData("/budgets"),
  });

  //Check for errors
  if (budgetsQuery.isError) return <div>Error</div>;

  const budgetsData = budgetsQuery.data;
  return (
    <div>
      <SectionContainer title="All Budgets">
        {budgetsQuery.isLoading ? (
          <Loader />
        ) : (
          <BudgetList budgets={budgetsData} />
        )}
      </SectionContainer>
      <SectionContainer title="Join a Budget">
        <FormContainer onSubmit={() => ""}>
          <TextInput
            placeholder="Ex. S3X4ZWZSPU"
            label="Enter a Budget Code:"
          />
        </FormContainer>
      </SectionContainer>
    </div>
  );
};
export default DashboardPage;
