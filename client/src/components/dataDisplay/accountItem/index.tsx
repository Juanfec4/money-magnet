import {
  IconEdit,
  IconPencilCheck,
  IconTrashFilled,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FC, useEffect, useState } from "react";
import { Account, Transaction } from "../../../types/global";
import api from "../../../utilities/api";
import { formatMoney } from "../../../utilities/helpers";
import IconButton from "../../buttons/iconButton";
import PrimaryButton from "../../buttons/primaryButton";
import FormContainer from "../../containers/form";
import OverlayContainer from "../../containers/overlay";
import SelectInput from "../../inputs/selectInput";
import TextInput from "../../inputs/textInput";
import ProgressBar from "../../ui/progressBar";

interface AccountItemProps {
  account: Account;
}
const AccountItem: FC<AccountItemProps> = ({ account }) => {
  //Query client
  const queryClient = useQueryClient();
  //Toggle delete confirmation
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  //Toggle edit form
  const [showEditForm, setShowEditForm] = useState(false);

  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountAmount, setNewAccountAmount] = useState("");
  const [newAccountType, setNewAccountType] = useState("");

  //Fetch budget transactions for type
  const budgetTransactionsQuery = useQuery({
    queryKey: ["budgetTransactions", account.id],
    queryFn: () =>
      api.fetchData("/transactions", {
        budget_id: account.budget_id,
        account_id: account.id,
      }),
  });

  //Update account
  const newAccountMutation = useMutation({
    mutationFn: (updatedAccount: Account) =>
      api.patchData(`/accounts/${account.id}`, updatedAccount),
    onSuccess: () => {
      setShowEditForm(false);
    },
    onSettled: () => {
      queryClient.refetchQueries({
        queryKey: ["budgetAccounts"],
      });
    },
  });

  //Fill in account information, edit account
  useEffect(() => {
    setNewAccountName(account.name);
    setNewAccountAmount(account.amount.toString());
    setNewAccountType(account.account_type);
  }, [showEditForm]);

  if (budgetTransactionsQuery.isLoading) return null;

  //Extract transactions
  const transactions = budgetTransactionsQuery.data as Transaction[];

  //Sum transactions
  const totalFromTransactions = transactions.reduce(
    (sum: number, transaction: Transaction) => sum + transaction.amount,
    0
  );

  //Delete account
  const deleteAccount = async () => {
    await api.deleteData(`/accounts/${account.id}`);
    setShowDeleteConfirmation(false);
    queryClient.fetchQuery({
      queryKey: [
        "budgetAccounts",
        account.account_type.toString(),
        account.budget_id.toString(),
      ],
    });
  };
  return (
    <div key={account.id} className="flex gap-4">
      <div className="flex justify-between max-w-xs w-full">
        <div className="capitalize">{account.name}</div>
        <div className="">{formatMoney(account.amount)}</div>
      </div>
      <ProgressBar total={account.amount} progress={totalFromTransactions} />
      <span className="flex gap-1">
        <IconEdit
          className=" cursor-pointer hover:text-lime-500 transition duration-200 h-5 w-5"
          onClick={() => setShowEditForm(true)}
        />
        <IconTrashFilled
          className="cursor-pointer hover:text-lime-500 transition duration-200 h-5 w-5"
          onClick={() => setShowDeleteConfirmation(true)}
        />
      </span>
      {showDeleteConfirmation ? (
        <OverlayContainer closeFn={() => setShowDeleteConfirmation(false)}>
          <div className="flex flex-col space-y-4 text-slate-200">
            <h1 className=" font-bold text-2xl mx-auto w-64 text-center">
              Are you sure you want to delete{" "}
              <span className="text-lime-500">{account.name}</span> ?
            </h1>
            <p>Performing this action will permanently delete the account.</p>
            <div className="flex items-center space-x-2 mx-auto">
              <span className="w-32 cursor-pointer">
                <PrimaryButton text="Delete" onClick={deleteAccount} />
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
      {showEditForm ? (
        <OverlayContainer closeFn={() => setShowEditForm(false)}>
          <FormContainer hideBorder={true} onSubmit={() => ""}>
            <h1 className=" text-slate-200 font-bold text-2xl mx-auto w-64 text-center">
              Edit account <span className="text-lime-500">{account.name}</span>
            </h1>
            <TextInput
              id="accountName"
              value={newAccountName}
              onChange={(e) => setNewAccountName(e.target.value)}
              label="Account name"
              placeholder="Account name"
            />
            <TextInput
              id="accountAmount"
              value={newAccountAmount}
              onChange={(e) => setNewAccountAmount(e.target.value)}
              label="Allocated amount"
              placeholder="Ex. 1,000"
            />
            <SelectInput
              options={["income", "expense", "saving", "investment"]}
              selected={newAccountType}
              changeFn={(selection) => setNewAccountType(selection)}
              label="Account type"
            />
            <PrimaryButton
              text="Save changes"
              onClick={() =>
                newAccountMutation.mutate({
                  ...account,
                  account_type: newAccountType,
                  amount: parseInt(newAccountAmount),
                  name: newAccountName,
                })
              }
            >
              <IconPencilCheck className="w-4 h-4" />
            </PrimaryButton>
          </FormContainer>
        </OverlayContainer>
      ) : null}
    </div>
  );
};
export default AccountItem;
