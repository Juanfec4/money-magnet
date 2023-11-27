import { Request } from "express";
import knexLibrary from "knex";
import { AccountType } from "../models/account.model";

export const isValidRequestBody = (
  request: Request,
  requestFields: string[]
): boolean => {
  for (let field of requestFields) {
    if (!request.body[field]) {
      return false;
    }
  }
  return true;
};

export const isValidRequestParams = (
  request: Request,
  paramFields: string[]
): boolean => {
  for (let field of paramFields) {
    if (!request.params[field]) {
      return false;
    }
  }
  return true;
};

export const isValidRequestQuery = (
  request: Request,
  queryFields: string[]
): boolean => {
  for (let field of queryFields) {
    if (!request.query[field]) {
      return false;
    }
  }
  return true;
};

interface ExtraQueryParams {
  "budget_members.member_type"?: string;
}

export const isMemberOfBudget = async (
  knex: knexLibrary.Knex,
  budgetId: number | string,
  userId: number | string,
  memberType?: string
): Promise<boolean> => {
  let extraQueryParams: ExtraQueryParams = {};

  //Assign member type query if exists
  if (memberType) {
    extraQueryParams["budget_members.member_type"] = memberType;
  }
  //Find budget with specified id where user is member
  const result = await knex("budgets")
    .select("member_type")
    .where({
      "budgets.id": budgetId,
      "budget_members.member_id": userId,
      ...extraQueryParams,
    })
    .join("budget_members", "budget_members.budget_id", "=", "budgets.id")
    .first();

  if (result) return true;

  return false;
};

export const isAccountTypeValid = (type: string): boolean => {
  return Object.values(AccountType).includes(type as AccountType);
};

export const isValidDateTimeFormat = (dateTimeString: string) => {
  const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  return regex.test(dateTimeString);
};

export const isValidISODate = (dateString: string): boolean => {
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
  return isoDatePattern.test(dateString);
};

export const isValidEmail = (email: string): boolean => {
  const validEmailPattern = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
  return validEmailPattern.test(email);
};

export const isValidPassword = (password: string): boolean => {
  const validPasswordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return validPasswordPattern.test(password);
};

export const isValidUsername = (username: string): boolean => {
  const validUsernamePattern = /^[A-Za-z0-9_-]+$/;
  return validUsernamePattern.test(username);
};
