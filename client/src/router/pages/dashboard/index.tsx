import { IconTablePlus } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import ErrorCard from "../../../components/alerts/error";
import InfoCard from "../../../components/alerts/info";
import PrimaryButton from "../../../components/buttons/primaryButton";
import FormContainer from "../../../components/containers/form";
import OverlayContainer from "../../../components/containers/overlay";
import SectionContainer from "../../../components/containers/section";
import TextInput from "../../../components/inputs/textInput";
import BudgetList from "../../../components/lists/budgetList";
import Loader from "../../../components/loaders/defaultLoader";
import useSearch from "../../../hooks/useSearch";
import { Budget, NewBudget } from "../../../types/global";
import api from "../../../utilities/api";

//Dashboard page
const DashboardPage: FC = () => {
  //New budget overlay
  const [showOverlay, setShowOverlay] = useState(false);

  //New budget name
  const [newBudgetName, setNewBudgetName] = useState("");

  //Form message
  const [formMessage, setFormMessage] = useState("");

  //Get budgets
  const budgetsQuery = useQuery({
    queryKey: ["budgets"],
    queryFn: () => api.fetchData("/budgets"),
  });

  //Post new budget
  const newBudgetMutation = useMutation({
    mutationFn: (newBudget: NewBudget) => api.postData("/budgets", newBudget),
    onError: () => setFormMessage("Missing budget name."),
    onSuccess: () => {
      setShowOverlay(false);
      setNewBudgetName("");
    },
    onSettled: () => budgetsQuery.refetch(),
  });

  const budgetsData = budgetsQuery.data;

  //Search filter
  const { searchTerm, filteredData, handleSearchChange } = useSearch({
    data: budgetsData || [],
    filterFn: (budget: Budget): boolean =>
      budget.name.toLowerCase().includes(searchTerm.toLowerCase()),
  });

  //Handle join budget

  return (
    <div>
      <SectionContainer
        title="All Budgets"
        titleLink={{ onClick: () => setShowOverlay(true), text: "New" }}
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
            id="budgetCode"
            value=""
            onChange={() => ""}
          />
          <PrimaryButton text="Join Budget" />
        </FormContainer>
      </SectionContainer>
      {showOverlay ? (
        <OverlayContainer closeFn={() => setShowOverlay(false)}>
          <FormContainer hideBorder={true}>
            <h1 className=" text-slate-200 font-bold text-2xl mx-auto">
              Create New Budget
            </h1>
            <TextInput
              placeholder="Budget name"
              label="Budget name"
              id="budgetName"
              value={newBudgetName}
              onChange={(e) => setNewBudgetName(e.target.value)}
            />
            <PrimaryButton
              text="Create"
              onClick={() => newBudgetMutation.mutate({ name: newBudgetName })}
            >
              <IconTablePlus className="w-4 h-4" />
            </PrimaryButton>
            {formMessage ? (
              <InfoCard
                message={formMessage}
                onClose={() => setFormMessage("")}
              />
            ) : null}
          </FormContainer>
        </OverlayContainer>
      ) : null}
    </div>
  );
};
export default DashboardPage;
