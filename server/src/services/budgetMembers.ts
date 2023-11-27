import knexLibrary from "knex";
import { BudgetMember } from "../models/budgetMember.model";

export const addBudgetMember = async (
  knex: knexLibrary.Knex,
  newMemberRecord: BudgetMember
) => {
  return await knex("budget_members").insert(newMemberRecord);
};

export const removeBudgetMember = async (
  knex: knexLibrary.Knex,
  budgetId: number | string,
  memberId: number | string
) => {
  return await knex("budget_members")
    .where({
      budget_id: budgetId,
      member_id: memberId,
      member_type: "collaborator",
    })
    .delete();
};

export const getBudgetMembers = async (
  knex: knexLibrary.Knex,
  budgetId: number | string
) => {
  return await knex("budget_members")
    .where({ budget_id: budgetId })
    .pluck("member_id");
};
