import { Request, Response } from "express";
import knexLibrary from "knex";
import knexConfig from "../../knexfile";
import { Transaction } from "../models/transaction.model";
import {
  isMemberOfBudget,
  isValidDateTimeFormat,
  isValidISODate,
  isValidRequestBody,
  isValidRequestParams,
  isValidRequestQuery,
} from "../services/validators";

const knex = knexLibrary(knexConfig);

//Create transaction
const createTransaction = async (req: Request, res: Response) => {
  //Get user id
  const user_id = req.user_id as string;

  //Validate request body
  if (
    !isValidRequestBody(req, [
      "name",
      "amount",
      "description",
      "transaction_date",
      "account_id",
    ])
  ) {
    return res.status(400).json("Missing request body fields.");
  }

  if (!isValidDateTimeFormat(req.body.transaction_date)) {
    return res
      .status(400)
      .json("Invalid date format use 'YYYY-MM-DD HH:mm:ss'.");
  }

  //Assign values to object
  const newTransactionObject: Transaction = {
    name: req.body.name,
    amount: req.body.amount,
    description: req.body.description,
    transaction_date: req.body.transaction_date,
    account_id: req.body.account_id,
  };

  try {
    //Get account from DB
    const account = await knex("accounts")
      .where({ id: req.body.account_id })
      .first();

    //Check if account exists
    if (!account) {
      return res.status(404).json("No account found for id");
    }

    //Check if user is member of budget associated with account
    if (!(await isMemberOfBudget(knex, account.budget_id, user_id))) {
      return res.status(403).json();
    }

    //Create transaction
    const [createdTransactionId] = await knex("transactions").insert(
      newTransactionObject
    );

    //Get created transaction
    const createdTransaction = await knex("transactions")
      .where({ id: createdTransactionId })
      .first();

    //Return created transaction
    return res.status(201).json(createdTransaction);
  } catch (e) {
    return res.status(500).json(e);
  }
};

//Get transaction
const getTransaction = async (req: Request, res: Response) => {
  //Get user id
  const user_id = req.user_id as string;

  //Validate request params
  if (!isValidRequestParams(req, ["id"]) || !req.params.id) {
    return res.status(400).json("Missing request id param.");
  }

  try {
    //Get transaction
    const transaction = await knex("transactions")
      .where({ id: req.params.id })
      .first();

    //If no transaction found 404
    if (!transaction) {
      return res.status(404).json();
    }

    //Get account linked to transaction
    const account = await knex("accounts")
      .where({
        id: transaction.account_id,
      })
      .first();

    //Verify if user is member of budget for that account
    if (!(await isMemberOfBudget(knex, account.budget_id, user_id))) {
      return res.status(403).json();
    }

    //Return transaction
    return res.status(200).json(transaction);
  } catch (e) {
    return res.status(500).json(e);
  }
};

//Get transactions
const getTransactions = async (req: Request, res: Response) => {
  //Get user id
  const user_id = req.user_id as string;

  //Validate required query params
  if (!isValidRequestQuery(req, ["budget_id"])) {
    return res.status(400).json("Missing request query params.");
  }

  //Check for proper budget id query
  if (typeof req.query.budget_id !== "string") {
    return res.status(400).json("Invalid query budget_id");
  }

  //Extract optional query params
  let accountId = req.query.account_id || undefined;
  let accountType = req.query.account_type || undefined;
  let [startDate, endDate] = [req.query.from, req.query.to] || undefined;

  //Handle filter by accountId type
  interface ExtraQueryParams {
    "accounts.id"?: string;
    "accounts.account_type"?: string;
  }

  let extraQueryParams: ExtraQueryParams = {};

  //Add extra query params
  if (typeof accountId === "string") {
    extraQueryParams["accounts.id"] = accountId;
  }

  if (typeof accountType === "string") {
    extraQueryParams["accounts.account_type"] = accountType;
  }

  //Format dates & check if they are valid format
  if (typeof startDate === "string" && typeof endDate === "string") {
    if (!isValidISODate(startDate) && isValidISODate(endDate)) {
      return res
        .status(400)
        .json("Invalid date params use format 'YYYY-MM-DD'.");
    }
  } else {
    startDate = "";
    endDate = "";
  }

  //Validate access to budget
  if (!(await isMemberOfBudget(knex, req.query.budget_id, user_id))) {
    return res.status(403).json();
  }

  try {
    //Get transactions
    let transactions;
    if (startDate && endDate) {
      transactions = await knex("transactions")
        .select(
          "transactions.id",
          "transactions.name",
          "transactions.amount",
          "transactions.description",
          "transactions.transaction_date",
          "transactions.account_id",
          "accounts.account_type as transaction_type",
          "accounts.name as account_name"
        )
        .join("accounts", "accounts.id", "=", "transactions.account_id")
        .where({ budget_id: req.query.budget_id, ...extraQueryParams })
        .whereBetween("transactions.transaction_date", [startDate, endDate]);
    } else {
      transactions = await knex("transactions")
        .select(
          "transactions.id",
          "transactions.name",
          "transactions.amount",
          "transactions.description",
          "transactions.transaction_date",
          "transactions.account_id",
          "accounts.account_type as transaction_type",
          "accounts.name as account_name"
        )
        .join("accounts", "accounts.id", "=", "transactions.account_id")
        .where({ budget_id: req.query.budget_id, ...extraQueryParams });
    }
    return res.status(200).json(transactions);
  } catch (e) {
    return res.status(500).json(e);
  }
};

//Update transaction
const editTransaction = async (req: Request, res: Response) => {
  //Get user id
  const user_id = req.user_id as string;

  //Validate request params
  if (!isValidRequestParams(req, ["id"]) || !req.params.id) {
    return res.status(400).json("Missing request id param.");
  }

  //Validate request body
  if (
    !isValidRequestBody(req, [
      "name",
      "amount",
      "description",
      "transaction_date",
      "account_id",
    ])
  ) {
    return res.status(400).json("Missing request body fields.");
  }

  //Validate date and time
  if (!isValidDateTimeFormat(req.body.transaction_date)) {
    return res
      .status(400)
      .json("Invalid date format use 'YYYY-MM-DD HH:mm:ss'.");
  }

  //Assign values to object
  const newTransactionObject: Transaction = {
    name: req.body.name,
    amount: req.body.amount,
    description: req.body.description,
    transaction_date: req.body.transaction_date,
    account_id: req.body.account_id,
  };

  try {
    //Get transaction account
    const account = await knex("transactions")
      .join("accounts", "accounts.id", "=", "transactions.account_id")
      .where({ "transactions.id": req.params.id })
      .first();

    // 404 if no account is found
    if (!account) {
      return res.status(404).json("No account found for transaction.");
    }
    //Validate if user has access to budget linked to account
    if (!(await isMemberOfBudget(knex, account.budget_id, user_id))) {
      return res.status(403).json();
    }
    //Update transaction
    await knex("transactions")
      .update(newTransactionObject)
      .where({ id: req.params.id });

    //Get updated transaction object
    const updatedTransaction = await knex("transactions")
      .select(
        "transactions.id",
        "transactions.name",
        "transactions.amount",
        "transactions.description",
        "transactions.transaction_date",
        "accounts.account_type as transaction_type"
      )
      .join("accounts", "accounts.id", "=", "transactions.account_id")
      .where({ "transactions.id": req.params.id })
      .first();

    return res.status(200).json(updatedTransaction);
  } catch (e) {
    return res.status(500).json(e);
  }
};

//Delete transaction
const deleteTransaction = async (req: Request, res: Response) => {
  //Get user id
  const user_id = req.user_id as string;

  //Validate request params
  if (!isValidRequestParams(req, ["id"]) || !req.params.id) {
    return res.status(400).json("Missing request id param.");
  }

  try {
    //Get transaction
    const transaction = await knex("transactions")
      .where({ id: req.params.id })
      .first();

    //If no transaction found 404
    if (!transaction) {
      return res.status(404).json();
    }

    //Get account linked to transaction
    const account = await knex("accounts")
      .where({
        id: transaction.account_id,
      })
      .first();

    //Verify if user is member of budget for that account
    if (!(await isMemberOfBudget(knex, account.budget_id, user_id))) {
      return res.status(403).json();
    }
    //Delete transaction by id
    const deletedCount = await knex("transactions")
      .where({ id: req.params.id })
      .delete();

    //If no transaction deleted return 404
    if (!deletedCount) {
      return res.status(404).json();
    }
    return res.status(204).json();
  } catch (e) {
    return res.status(500).json(e);
  }
};

export default {
  createTransaction,
  getTransaction,
  getTransactions,
  editTransaction,
  deleteTransaction,
};
