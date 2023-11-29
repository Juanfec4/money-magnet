import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { Account, Transaction } from "../../../types/global";
import api from "../../../utilities/api";
import { formatMoney } from "../../../utilities/helpers";
import ProgressBar from "../../ui/progressBar";

interface AccountItemProps {
  account: Account;
}
const AccountItem: FC<AccountItemProps> = ({ account }) => {
  //Fetch budget transactions for type
  const budgetTransactionsQuery = useQuery({
    queryKey: ["budgetTransactions", account.id],
    queryFn: () =>
      api.fetchData("/transactions", {
        budget_id: account.budget_id,
        account_id: account.id,
      }),
  });

  if (budgetTransactionsQuery.isLoading) return null;

  //Extract transactions
  const transactions = budgetTransactionsQuery.data as Transaction[];

  //Sum transactions
  const totalFromTransactions = transactions.reduce(
    (sum: number, transaction: Transaction) => sum + transaction.amount,
    0
  );
  return (
    <div key={account.id} className="flex gap-4">
      <div className="flex justify-between max-w-sm w-full">
        <div className="capitalize">{account.name}</div>
        <div className="">{formatMoney(account.amount)}</div>
      </div>
      <ProgressBar total={account.amount} progress={totalFromTransactions} />
    </div>
  );
};
export default AccountItem;
