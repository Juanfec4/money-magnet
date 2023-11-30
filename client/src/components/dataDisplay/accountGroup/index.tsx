import {
  IconSortAscendingLetters,
  IconSortAscendingNumbers,
  IconSortDescendingLetters,
  IconSortDescendingNumbers,
  IconSquarePlus2,
  IconTriangleFilled,
  IconTriangleInvertedFilled,
} from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import { Account } from "../../../types/global";
import api from "../../../utilities/api";
import { formatMoney } from "../../../utilities/helpers";
import PrimaryButton from "../../buttons/primaryButton";
import FormContainer from "../../containers/form";
import OverlayContainer from "../../containers/overlay";
import TextInput from "../../inputs/textInput";
import AccountItem from "../accountItem";
//Account Group Props
interface AccountGroupProps {
  type: string;
  name: string;
  budgetId: number;
}

const AccountGroup: FC<AccountGroupProps> = ({ budgetId, type, name }) => {
  //Toggle accounts
  const [showAccounts, setShowAccounts] = useState(true);

  //Sort selection
  const [sortBy, setSortBy] = useState("");

  //Toggle add form
  const [showAddForm, setShowAddForm] = useState(false);

  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountAmount, setNewAccountAmount] = useState("");

  //Fetch budget accounts for type
  const budgetAccountsQuery = useQuery({
    queryKey: ["budgetAccounts", type, budgetId],
    queryFn: () =>
      api.fetchData("/accounts", { budget_id: budgetId, account_type: type }),
  });

  //Add account
  const newAccountMutation = useMutation({
    mutationFn: (newAccount: Account) => api.postData(`/accounts/`, newAccount),
    onSuccess: () => {
      setShowAddForm(false);
    },
    onSettled: () => {
      budgetAccountsQuery.refetch();
    },
  });

  if (budgetAccountsQuery.isLoading) return <>Loading...</>;

  //Accounts filtered by name
  const accounts = budgetAccountsQuery.data;

  if (sortBy === "name-asc") {
    accounts.sort((a: Account, b: Account) =>
      a.name.localeCompare(b.name)
    ) as Account[];
  }

  if (sortBy === "name-desc") {
    accounts.sort((a: Account, b: Account) =>
      b.name.localeCompare(a.name)
    ) as Account[];
  }

  if (sortBy === "allocated-asc") {
    accounts.sort((a: Account, b: Account) => a.amount - b.amount) as Account[];
  }

  if (sortBy === "allocated-desc") {
    accounts.sort((a: Account, b: Account) => b.amount - a.amount) as Account[];
  }

  //Get total for Account group
  const totalFromAccounts = accounts.reduce(
    (sum: number, account: Account) => sum + account.amount,
    0
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end space-x-2 justify-between max-w-xs">
        <span className="flex items-center gap-2">
          {showAccounts ? (
            <IconTriangleFilled
              className="h-2 w-2 text-gray-500 hover:text-lime-400 cursor-pointer transition duration-200"
              onClick={() => setShowAccounts(false)}
            />
          ) : (
            <IconTriangleInvertedFilled
              className="h-2 w-2 text-gray-500 hover:text-lime-400 cursor-pointer transition duration-200"
              onClick={() => setShowAccounts(true)}
            />
          )}
          <h4 className="text-lg font-bold decoration-double underline decoration-gray-700 text-lime-500">
            {name}
          </h4>
          {" | "}
          <a
            className="font-bold hover:text-lime-400 cursor-pointer transition duration-200"
            onClick={() => setShowAddForm(true)}
          >
            Add
          </a>
        </span>
        <h4 className=" text-lime-500">{formatMoney(totalFromAccounts)}</h4>
      </div>
      {showAccounts ? (
        <div className="flex flex-col gap-1">
          <div className="flex space-x-2 justify-between max-w-xs">
            <div className="font-bold  text-sm md:text-md flex items-center gap-1">
              {sortBy === "name-asc" ? (
                <IconSortAscendingLetters
                  className="w-4 h-4 cursor-pointer hover:text-lime-500 transition duration-200 text-slate-200/50"
                  onClick={() => setSortBy("name-desc")}
                />
              ) : (
                <IconSortDescendingLetters
                  className="w-4 h-4 cursor-pointer hover:text-lime-500 transition duration-200 text-slate-200/50"
                  onClick={() => setSortBy("name-asc")}
                />
              )}
              Account
            </div>
            <div className="font-bold  text-sm md:text-md flex items-center gap-1">
              {sortBy === "allocated-asc" ? (
                <IconSortAscendingNumbers
                  className="w-4 h-4 cursor-pointer hover:text-lime-500 transition duration-200 text-slate-200/50"
                  onClick={() => setSortBy("allocated-desc")}
                />
              ) : (
                <IconSortDescendingNumbers
                  className="w-4 h-4 cursor-pointer hover:text-lime-500 transition duration-200 text-slate-200/50"
                  onClick={() => setSortBy("allocated-asc")}
                />
              )}
              Allocated
            </div>
          </div>
          {accounts.map((account: Account) => {
            return <AccountItem key={account.id} account={account} />;
          })}
        </div>
      ) : null}
      {showAddForm ? (
        <OverlayContainer closeFn={() => setShowAddForm(false)}>
          <FormContainer hideBorder={true} onSubmit={() => ""}>
            <h1 className=" text-slate-200 font-bold text-2xl mx-auto w-64 text-center">
              New account
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
            <PrimaryButton
              text="Create account"
              onClick={() =>
                newAccountMutation.mutate({
                  account_type: type,
                  amount: parseInt(newAccountAmount),
                  name: newAccountName,
                  budget_id: budgetId,
                })
              }
            >
              <IconSquarePlus2 className="w-4 h-4" />
            </PrimaryButton>
          </FormContainer>
        </OverlayContainer>
      ) : null}
    </div>
  );
};
export default AccountGroup;
