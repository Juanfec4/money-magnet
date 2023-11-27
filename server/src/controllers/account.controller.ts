import { Request, Response } from "express";
import knexConfig from "../../knexfile";
import knexLibrary from "knex";
import {
  isAccountTypeValid,
  isMemberOfBudget,
  isValidRequestBody,
  isValidRequestParams,
  isValidRequestQuery,
} from "../services/validators";
import { Account } from "../models/account.model";

const knex = knexLibrary(knexConfig);

//Create account
const createAccount = async (req: Request, res: Response) => {
  //Get user id
  const user_id = req.user_id as string;

  //Validate request body
  if (
    !isValidRequestBody(req, ["name", "account_type", "amount", "budget_id"])
  ) {
    return res.status(400).json("Missing request body fields.");
  }

  //Validate if account type matches options
  if (!isAccountTypeValid(req.body.account_type)) {
    return res.status(400).json("Invalid account type.");
  }

  //Validate if user is member of budget
  if (!(await isMemberOfBudget(knex, req.body.budget_id, user_id))) {
    return res.status(403).json();
  }

  const newAccountObject: Account = {
    name: req.body.name,
    account_type: req.body.account_type,
    amount: req.body.amount,
    budget_id: req.body.budget_id,
  };

  try {
    //create account object in DB
    const [createdAccountId] = await knex("accounts").insert(newAccountObject);

    //Get created account
    const createdAccount = await knex("accounts")
      .where({ id: createdAccountId })
      .first();

    //Return created account
    return res.status(201).json(createdAccount);
  } catch (e) {
    return res.status(500).json(e);
  }
};

//Get all accounts
const getAccounts = async (req: Request, res: Response) => {
  //Get user id
  const user_id = req.user_id as string;

  //Validate required query params
  if (!isValidRequestQuery(req, ["budget_id"])) {
    return res.status(400).json("Missing request query params.");
  }

  //Check for proper query
  if (typeof req.query.budget_id !== "string") {
    return res.status(400).json("Invalid query budget_id");
  }

  //Validate if user is member of budget
  if (!(await isMemberOfBudget(knex, req.query.budget_id, user_id))) {
    return res.status(403).json();
  }

  //Handle filter by account type
  interface ExtraQueryParams {
    "accounts.account_type"?: string;
  }

  let extraQueryParams: ExtraQueryParams = {};
  if (typeof req.query.account_type == "string") {
    //Validate if account type matches options
    if (!isAccountTypeValid(req.query.account_type)) {
      return res.status(400).json("Invalid account type.");
    }
    extraQueryParams["accounts.account_type"] = req.query.account_type;
  }

  try {
    //Get all budget accounts
    const accounts = await knex("accounts").where({
      budget_id: req.query.budget_id,
      ...extraQueryParams,
    });
    return res.status(200).json(accounts);
  } catch (e) {
    return res.status(500).json(e);
  }
};

//Get account
const getAccount = async (req: Request, res: Response) => {
  //Get user id
  const user_id = req.user_id as string;

  //Validate request params
  if (!isValidRequestParams(req, ["id"]) || !req.params.id) {
    return res.status(400).json("Missing request id param.");
  }

  try {
    //Get account
    const account = await knex("accounts").where({ id: req.params.id }).first();

    //If no account return 404
    if (!account) {
      return res.status(404).json();
    }

    //If user is not member return unauthorized
    if (!(await isMemberOfBudget(knex, account.budget_id, user_id))) {
      return res.status(403).json();
    }

    return res.status(200).json(account);
  } catch (e) {
    return res.status(500).json(e);
  }
};

//Edit account
const editAccount = async (req: Request, res: Response) => {
  //Get user id
  const user_id = req.user_id as string;

  //Validate request params
  if (!isValidRequestParams(req, ["id"]) || !req.params.id) {
    return res.status(400).json("Missing request id param.");
  }

  //Validate request body
  if (!isValidRequestBody(req, ["name", "account_type", "amount"])) {
    return res.status(400).json("Missing request body fields.");
  }

  //Validate if new account type matches options
  if (!isAccountTypeValid(req.body.account_type)) {
    return res.status(400).json("Invalid account type.");
  }

  try {
    const budget = await knex("accounts")
      .select("budget_id")
      .where({ id: req.params.id })
      .first();

    //Validate if user is member of budget
    if (!(await isMemberOfBudget(knex, budget.budget_id, user_id))) {
      return res.status(403).json();
    }

    //Create new account object
    const newAccountObject: Account = {
      name: req.body.name,
      account_type: req.body.account_type,
      amount: req.body.amount,
      budget_id: budget.budget_id,
    };

    //Update account on DB
    await knex("accounts")
      .where({ id: req.params.id })
      .update(newAccountObject);

    //Get updated account
    const account = await knex("accounts")
      .select("*")
      .where({ id: req.params.id })
      .first();

    return res.status(200).json(account);
  } catch (e) {
    return res.status(500).json(e);
  }
};

//Delete account
const deleteAccount = async (req: Request, res: Response) => {
  //Get user id
  const user_id = req.user_id as string;

  //Validate request params
  if (!isValidRequestParams(req, ["id"]) || !req.params.id) {
    return res.status(400).json("Missing request id param.");
  }

  try {
    //Get account
    const account = await knex("accounts").where({ id: req.params.id }).first();

    //If no account return 404
    if (!account) {
      return res.status(404).json();
    }

    //If user is not member return unauthorized
    if (!(await isMemberOfBudget(knex, account.budget_id, user_id))) {
      return res.status(403).json();
    }

    //Delete account
    const deletedCount = await knex("accounts")
      .where({ id: req.params.id })
      .delete();

    //If no account deleted return 404
    if (!deletedCount) {
      return res.status(404).json();
    }

    return res.status(204).json();
  } catch (e) {
    return res.status(500).json(e);
  }
};

export default {
  createAccount,
  getAccounts,
  getAccount,
  editAccount,
  deleteAccount,
};
