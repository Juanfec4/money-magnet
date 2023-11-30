import { IconEdit, IconTrashFilled } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import { Transaction } from "../../../types/global";
import api from "../../../utilities/api";
import { formatDate, formatMoney } from "../../../utilities/helpers";
import IconButton from "../../buttons/iconButton";
import PrimaryButton from "../../buttons/primaryButton";
import OverlayContainer from "../../containers/overlay";
import DefaultLoader from "../../loaders/defaultLoader";

interface TransactionListProps {
  budgetId: number;
}

const TransactionList: FC<TransactionListProps> = ({ budgetId }) => {
  //Show transactions
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<
    Transaction | undefined
  >(undefined);

  //Show delete confirmation
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const transactionsQuery = useQuery({
    queryKey: ["transactions", budgetId],
    queryFn: () => api.fetchData(`/transactions`, { budget_id: budgetId }),
  });

  //Delete transaction
  const deleteTransaction = async () => {
    await api.deleteData(`/transactions/${selectedTransaction?.id}`);
    setShowDeleteConfirmation(false);
    setShowTransactionDetails(false);
    setSelectedTransaction(undefined);
    transactionsQuery.refetch();
  };

  if (transactionsQuery.isError) return null;

  const transactions = transactionsQuery.data;

  return (
    <div className="my-16">
      <h3 className="text-2xl mb-3 pl-2 border-l border-lime-500 text-slate-200">
        Transactions
      </h3>
      <div className="max-h-96 overflow-y-auto rounded-md">
        {transactionsQuery.isLoading && <DefaultLoader />}
        {transactionsQuery.isSuccess && (
          <table className="min-w-full divide-y divide-gray-200/20 rounded-md overflow-hidden">
            <thead className="bg-slate-500/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-200 uppercase tracking-wider hidden md:block">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction: Transaction) => (
                <tr
                  key={transaction.id}
                  className="bg-slate-500/20 hover:bg-slate-500/30 cursor-pointer "
                  onClick={() => {
                    setShowTransactionDetails(true);
                    setSelectedTransaction(transaction);
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-lime-500 capitalize">
                      {transaction.name}
                    </p>
                    <p className="text-sm md:hidden">
                      {formatDate(transaction.transaction_date)}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-lime-500">
                      {formatMoney(transaction.amount)}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:block">
                    <p className="text-sm ">
                      {formatDate(transaction.transaction_date)}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showTransactionDetails && selectedTransaction ? (
        <OverlayContainer closeFn={() => setShowTransactionDetails(false)}>
          <div className="flex sm:items-start  w-72 sm:w-full sm:h-48 sm:border-b-[1px] pb-6 border-slate-700 flex-col sm:flex-row mx-auto">
            <div className="flex gap-2 h-full items-start sm:border-r-[1px] p-6 relative border-slate-700">
              <span className="flex flex-col h-full w-48">
                <h3 className="text-xl font-bold text-lime-500">
                  {selectedTransaction.name}
                </h3>
                <p className="text-sm text-slate-200/60">
                  {formatDate(selectedTransaction.transaction_date)}
                </p>
                <p className="mt-2 text-xl">
                  {formatMoney(selectedTransaction.amount)}
                </p>
                <p className="capitalize italic text-slate-200/60 absolute top-0 text-sm">
                  {selectedTransaction.transaction_type}
                </p>
                <p className="text-sm text-slate-200/60">
                  On account{" "}
                  <span className="text-lime-500 font-bold">
                    {selectedTransaction.account_name}
                  </span>
                </p>
                <div className="flex gap-2 justify-start pt-2">
                  <IconEdit className="h-5 w-5 cursor-pointer hover:text-lime-500" />
                  <IconTrashFilled
                    className="h-5 w-5 cursor-pointer hover:text-lime-500"
                    onClick={() => {
                      setShowDeleteConfirmation(true);
                      setShowTransactionDetails(false);
                    }}
                  />
                </div>
              </span>
            </div>
            <div className="flex-grow p-6 h-full">
              <p className="py-1 text-xs">Description</p>
              <p className="p-2 bg-slate-800 rounded-md h-full max-h-full overflow-y-scroll ">
                {selectedTransaction.description}
              </p>
            </div>
          </div>
        </OverlayContainer>
      ) : null}
      {showDeleteConfirmation && selectedTransaction ? (
        <OverlayContainer
          closeFn={() => {
            setShowDeleteConfirmation(false);
            setShowTransactionDetails(true);
          }}
        >
          <div className="flex flex-col space-y-4 text-slate-200">
            <h1 className=" font-bold text-2xl mx-auto w-64 text-center">
              Are you sure you want to delete{" "}
              <span className="text-lime-500">{selectedTransaction.name}</span>{" "}
              ?
            </h1>
            <p>
              Performing this action will permanently delete the transaction.
            </p>
            <div className="flex items-center gap-2 mx-auto flex-col sm:flex-row">
              <span className="w-32 cursor-pointer">
                <PrimaryButton text="Delete" onClick={deleteTransaction} />
              </span>
              <span className="w-32 cursor-pointer">
                <IconButton
                  text="Cancel"
                  children={null}
                  onClick={() => {
                    setShowDeleteConfirmation(false);
                    setShowTransactionDetails(true);
                  }}
                />
              </span>
            </div>
          </div>
        </OverlayContainer>
      ) : null}
    </div>
  );
};

export default TransactionList;
