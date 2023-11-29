import {
  IconTriangleFilled,
  IconTriangleInvertedFilled,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import { Account } from "../../../types/global";
import api from "../../../utilities/api";
import { formatMoney } from "../../../utilities/helpers";
import AccountItem from "../accountItem";
//Account Group Props
interface AccountGroupProps {
  type: string;
  name: string;
  budgetId: string | number;
}

const AccountGroup: FC<AccountGroupProps> = ({ budgetId, type, name }) => {
  //Toggle accounts
  const [showAccounts, setShowAccounts] = useState(true);
  //Fetch budget accounts for type
  const budgetAccountsQuery = useQuery({
    queryKey: ["budgetAccounts", type, budgetId],
    queryFn: () =>
      api.fetchData("/accounts", { budget_id: budgetId, account_type: type }),
  });

  //Fetch budget transactions for type
  const budgetTransactionsQuery = useQuery({
    queryKey: ["budgetTransactions", type, budgetId],
    queryFn: () =>
      api.fetchData("/transactions", {
        budget_id: budgetId,
        account_type: type,
      }),
  });

  if (budgetAccountsQuery.isLoading) return <>Loading...</>;

  //Accounts filtered by name
  const accounts = budgetAccountsQuery.data.sort((a: Account, b: Account) =>
    a.name.localeCompare(b.name)
  ) as Account[];

  //Get total for Account group
  const totalFromAccounts = accounts.reduce(
    (sum: number, account: Account) => sum + account.amount,
    0
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end space-x-2 justify-between max-w-sm">
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
            href=""
            className="font-bold hover:text-lime-400 cursor-pointer transition duration-200"
          >
            Add
          </a>
        </span>
        <h4 className=" text-lime-500">{formatMoney(totalFromAccounts)}</h4>
      </div>
      {showAccounts ? (
        <div className="flex flex-col gap-1">
          <div className="flex space-x-2 justify-between max-w-sm">
            <div className="font-bold  text-sm md:text-md ">Account</div>
            <div className="font-bold  text-sm md:text-md  hidden md:block">
              Allocated
            </div>
          </div>
          {accounts.map((account) => {
            return <AccountItem key={account.id} account={account} />;
          })}
        </div>
      ) : null}
    </div>
  );
};
export default AccountGroup;
