export enum AccountType {
  Income = "income",
  Expense = "expense",
  Saving = "saving",
  Investment = "investment",
}

export interface Account {
  id?: number;
  name: string;
  account_type: AccountType;
  amount: number;
  budget_id: number;
}
