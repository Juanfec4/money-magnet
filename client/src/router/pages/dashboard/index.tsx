import { FC, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../utilities/api";
import BudgetList from "../../../components/lists/budgetList";
import Loader from "../../../components/loaders/defaultLoader";
import SectionContainer from "../../../components/containers/section";
import FormContainer from "../../../components/containers/form";
import TextInput from "../../../components/inputs/textInput";
import ErrorCard from "../../../components/alerts/error";
import PrimaryButton from "../../../components/buttons/primaryButton";
import useSearch from "../../../hooks/useSearch";
import { Budget, NewBudget } from "../../../types/global";
import OverlayContainer from "../../../components/containers/overlay";
import { IconSquarePlus2 } from "@tabler/icons-react";
import InfoCard from "../../../components/alerts/info";

//Dashboard page
const DashboardPage: FC = () => {
  //New budget overlay
  const [showOverlay, setShowOverlay] = useState(true);

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
    onSettled: () => budgetsQuery.refetch(),
  });

  const budgetsData = budgetsQuery.data;

  //Search filter
  const { searchTerm, filteredData, handleSearchChange } = useSearch({
    data: budgetsData || [],
    filterFn: (budget: Budget): boolean =>
      budget.name.toLowerCase().includes(searchTerm.toLowerCase()),
  });

  //Handle new budget
  const createNewBudget = (budgetName: string) => {
    if (budgetName !== "") {
      //Post request
      newBudgetMutation.mutate({ name: budgetName });
      //Reset state
      setShowOverlay(false);
      setNewBudgetName("");
    } else {
      setFormMessage("Missing name");
    }
  };
  //Handle join budget

  return (
    <div>
      <SectionContainer
        title="All Budgets"
        titleLink={{ onClick: () => setShowOverlay(true), text: "new" }}
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
              onClick={() => createNewBudget(newBudgetName)}
            >
              <IconSquarePlus2 className="w-4 h-4" />
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
