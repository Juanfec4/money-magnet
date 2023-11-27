export interface Transaction {
  id?: number;
  name: string;
  amount: number | string;
  description: string;
  transaction_date: Date;
  account_id: number | string;
}
