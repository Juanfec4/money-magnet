export type Member = {
  username: string;
  id: number;
};

export interface Budget {
  id: number;
  name: string;
  unique_code: string;
  members?: Member[];
  is_owner?: boolean;
  user_id?: number;
}

export interface NewBudget {
  name: string;
}

export interface Account {
  id?: number;
  name: string;
  account_type: string;
  amount: number;
  budget_id: number;
}

export interface Transaction {
  id: number;
  name: string;
  description: string;
  transaction_type: string;
  amount: number;
  transaction_date: string;
}
