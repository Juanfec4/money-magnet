import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../utilities/api";
import BudgetList from "../../../components/lists/budgetList";
import Loader from "../../../components/loaders/defaultLoader";
import SectionContainer from "../../../components/containers/section";
import FormContainer from "../../../components/containers/form";
import TextInput from "../../../components/inputs/textInput";
import ErrorCard from "../../../components/alerts/error";
import PrimaryButton from "../../../components/buttons/primaryButton";
import useSearch from "../../../hooks/useSearch";
import { Budget } from "../../../types/global";

//Dashboard page
const DashboardPage: FC = () => {
  //Get budgets
  const budgetsQuery = useQuery({
    queryKey: ["budgets"],
    queryFn: () => api.fetchData("/budgets"),
  });

  const budgetsData = budgetsQuery.data;

  //Search filter
  const { searchTerm, filteredData, handleSearchChange } = useSearch({
    data: budgetsData || [],
    filterFn: (budget: Budget): boolean => budget.name.includes(searchTerm),
  });

  return (
    <div>
      <SectionContainer
        title="All Budgets"
        titleLink={{ onClick: () => {}, text: "new" }}
        sectionSearch={{
          value: searchTerm,
          onChange: (e) => handleSearchChange(e.target.value),
        }}
      >
        {budgetsQuery.isLoading ? (
          <Loader />
        ) : budgetsQuery.isError ? (
          <ErrorCard
            error={`${budgetsQuery.error.message}, please try again later.`}
          />
        ) : (
          <BudgetList budgets={filteredData} />
        )}
      </SectionContainer>
      <SectionContainer title="Join an Existing Budget">
        <FormContainer onSubmit={() => ""}>
          <TextInput
            placeholder="Ex. S3X4ZWZSPU"
            label="Enter a 10 digit budget code:"
          />
          <PrimaryButton text="Join Budget" />
        </FormContainer>
      </SectionContainer>
    </div>
  );
};
export default DashboardPage;
