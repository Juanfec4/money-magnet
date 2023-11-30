import { IconPencilCheck, IconTrashFilled } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorCard from "../../../components/alerts/error";
import InfoCard from "../../../components/alerts/info";
import IconButton from "../../../components/buttons/iconButton";
import PrimaryButton from "../../../components/buttons/primaryButton";
import BudgetContainer from "../../../components/containers/budget";
import FormContainer from "../../../components/containers/form";
import OverlayContainer from "../../../components/containers/overlay";
import SectionContainer from "../../../components/containers/section";
import AccountGroup from "../../../components/dataDisplay/accountGroup";
import TextInput from "../../../components/inputs/textInput";
import BudgetMembersList from "../../../components/lists/budgetMemberList";
import EditMembersList from "../../../components/lists/editMembersList";
import TransactionList from "../../../components/lists/transactionList";
import DefaultLoader from "../../../components/loaders/defaultLoader";
import FeaturedText from "../../../components/ui/featuredText";
import { Budget, Member } from "../../../types/global";
import api from "../../../utilities/api";

const BudgetPage: FC = () => {
  //Get budget id
  const { id } = useParams();

  //Navigator
  const navigator = useNavigate();

  //Toggle edit overlay
  const [showEditForm, setShowEditForm] = useState(false);

  //Toggle delete overlay
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  //Form data
  const [newBudgetName, setNewBudgetName] = useState("");
  const [newBudgetMembers, setNewBudgetMembers] = useState<Member[]>([]);
  const [formMessage, setFormMessage] = useState("");

  //Fetch budget info
  const budgetInfoQuery = useQuery({
    queryKey: ["budgetInfo", id],
    queryFn: () => api.fetchData(`/budgets/${id}`),
  });

  //Update budget
  const newBudgetMutation = useMutation({
    mutationFn: (updatedBudget: Budget) =>
      api.patchData(`/budgets/${id}`, updatedBudget),
    onError: () => setFormMessage("Missing budget name."),
    onSuccess: () => {
      setShowEditForm(false);
      setNewBudgetName("");
    },
    onSettled: () => budgetInfoQuery.refetch(),
  });

  //Delete budget
  const deleteBudget = async () => {
    await api.deleteData(`/budgets/${id}`);
    setShowDeleteConfirmation(false);
    navigator("/web-app/dashboard");
  };

  const budget = budgetInfoQuery.data as Budget;

  //Populate form
  useEffect(() => {
    if (budget && budget.members) {
      setNewBudgetName(budget.name);
      setNewBudgetMembers(budget.members);
    }
  }, [showEditForm]);

  //Handle remove member
  const removeMember = (member_id: number) => {
    const newMembers: Member[] = [...newBudgetMembers].filter(
      (member) => member.id !== member_id
    );
    setNewBudgetMembers(newMembers);
  };

  //Handle reset members
  const resetMembers = () => {
    setNewBudgetMembers(budget.members || []);
  };

  return budgetInfoQuery.isLoading ? (
    <DefaultLoader />
  ) : budgetInfoQuery.isError ? (
    <ErrorCard
      error={`${budgetInfoQuery.error.message}, please try again later.`}
    />
  ) : (
    <div>
      <SectionContainer
        title={budget.name}
        titleLink={
          budget.is_owner
            ? { onClick: () => setShowEditForm(true), text: "Edit" }
            : undefined
        }
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
        <TransactionList budgetId={budget.id} />
        <BudgetMembersList members={budget.members} />

        {budget.is_owner ? (
          <div className=" w-48 my-12">
            <PrimaryButton
              text="Delete budget"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              <IconTrashFilled className="h-5 w-5" />
            </PrimaryButton>
          </div>
        ) : null}
      </SectionContainer>
      {showEditForm ? (
        <OverlayContainer closeFn={() => setShowEditForm(false)}>
          <FormContainer hideBorder={true} onSubmit={() => ""}>
            <h1 className=" text-slate-200 font-bold text-2xl mx-auto w-64 text-center">
              Edit budget <span className="text-lime-500">{budget.name}</span>
            </h1>
            <TextInput
              placeholder="Budget name"
              label="Rename budget"
              id="budgetName"
              value={newBudgetName}
              onChange={(e) => setNewBudgetName(e.target.value)}
            />
            {budget.members && budget.members.length > 1 ? (
              <EditMembersList
                members={newBudgetMembers}
                user_id={budget.user_id}
                removeFn={removeMember}
                resetFn={resetMembers}
              />
            ) : null}
            <PrimaryButton
              text="Save changes"
              onClick={() =>
                newBudgetMutation.mutate({
                  ...budget,
                  name: newBudgetName,
                  members: newBudgetMembers,
                })
              }
            >
              <IconPencilCheck className="w-4 h-4" />
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
      {showDeleteConfirmation ? (
        <OverlayContainer closeFn={() => setShowDeleteConfirmation(false)}>
          <div className="flex flex-col space-y-4 text-slate-200">
            <h1 className=" font-bold text-2xl mx-auto w-64 text-center">
              Are you sure you want to delete{" "}
              <span className="text-lime-500">{budget.name}</span> ?
            </h1>
            <p>Performing this action will permanently delete the budget.</p>
            <div className="flex items-center space-x-2 mx-auto">
              <span className="w-32 cursor-pointer">
                <PrimaryButton text="Delete" onClick={deleteBudget} />
              </span>
              <span className="w-32 cursor-pointer">
                <IconButton
                  text="Cancel"
                  children={null}
                  onClick={() => setShowDeleteConfirmation(false)}
                />
              </span>
            </div>
          </div>
        </OverlayContainer>
      ) : null}
    </div>
  );
};
export default BudgetPage;
