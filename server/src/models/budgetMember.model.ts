export interface BudgetMember {
  id?: number;
  budget_id: number | string;
  member_id: number | string;
  member_type: "owner" | "collaborator";
}
