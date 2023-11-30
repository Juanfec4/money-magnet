import { Request, Response } from "express";
import knexLibrary from "knex";
import knexConfig from "../../knexfile";
import { Budget } from "../models/budget.model";
import {
  addBudgetMember,
  getBudgetMembers,
  removeBudgetMember,
} from "../services/budgetMembers";
import { generateUUID } from "../services/uuidGenerator";
import {
  isMemberOfBudget,
  isValidRequestBody,
  isValidRequestParams,
} from "../services/validators";

const knex = knexLibrary(knexConfig);

//Create budget
const createBudget = async (req: Request, res: Response) => {
  //Get user id
  const user_id = req.user_id as string;

  //Validate request body
  if (!isValidRequestBody(req, ["name"])) {
    return res.status(400).json("Missing request body fields.");
  }

  //Create budget invite code
  const unique_code = await generateUUID();

  //Assign values to object
  const newBudgetObject: Budget = {
    unique_code,
    name: req.body.name,
  };

  try {
    //Create budget object in DB
    const [createdBudgetId] = await knex("budgets").insert(newBudgetObject);

    //Create budget member
    await addBudgetMember(knex, {
      budget_id: createdBudgetId,
      member_id: user_id,
      member_type: "owner",
    });

    //Get created budget
    const createdBudget = await knex("budgets")
      .where({ id: createdBudgetId })
      .first();

    //Return created object
    return res.status(201).json(createdBudget);
  } catch (e) {
    return res.status(500).json(e);
  }
};

//Get all budgets
const getBudgets = async (req: Request, res: Response) => {
  //Get user id
  const user_id = req.user_id as string;

  try {
    //Get budget
    const budgets = await knex("budgets")
      .select("budgets.name", "budgets.unique_code", "budgets.id")
      .where({
        "budget_members.member_id": user_id,
      })
      .join("budget_members", "budgets.id", "=", "budget_members.budget_id");

    return res.status(200).json(budgets);
  } catch (e) {
    return res.status(500).json(e);
  }
};

//Get budget
const getBudget = async (req: Request, res: Response) => {
  //Get user id
  const user_id = req.user_id as string;

  //Validate request params
  if (!isValidRequestParams(req, ["id"]) || !req.params.id) {
    return res.status(400).json("Missing request id param.");
  }

  //Validate if user has access to budget
  if (!(await isMemberOfBudget(knex, req.params.id, user_id))) {
    return res.status(403).json();
  }

  try {
    //Get budget
    const budget = await knex("budgets")
      .select("*")
      .where({ id: req.params.id })
      .first();

    //Get budget member ids
    const memberIds = await getBudgetMembers(knex, req.params.id);

    //Get budget usernames for each member withing the budget members
    const budgetMembers = await knex("users")
      .select("username", "id")
      .whereIn("id", memberIds);

    //Get budget owner
    const budgetOwners = await knex("budget_members")
      .where({
        budget_id: req.params.id,
        member_type: "owner",
      })
      .pluck("budget_members.member_id");

    //Check if user is owner
    const is_owner = budgetOwners.includes(user_id);

    return res
      .status(200)
      .json({ ...budget, is_owner, user_id, members: budgetMembers });
  } catch (e) {
    return res.status(500).json(e);
  }
};

//Edit budget
const editBudget = async (req: Request, res: Response) => {
  //Get user id
  const user_id = req.user_id as string;

  //Validate request params
  if (!isValidRequestParams(req, ["id"]) || !req.params.id) {
    return res.status(400).json("Missing request id param.");
  }

  //Validate request body
  if (!isValidRequestBody(req, ["name", "members"])) {
    return res.status(400).json("Missing request body fields.");
  }

  //Validate if user has owner access to budget
  if (!(await isMemberOfBudget(knex, req.params.id, user_id, "owner"))) {
    return res.status(403).json();
  }

  interface Member {
    username: string;
    id: number;
  }

  try {
    //Extract request body members array
    const newMembers: Member[] = req.body.members;
    const newMembersIds = newMembers.map((member) => member.id);

    //Get existing budget members array
    const existingBudgetMembers = await getBudgetMembers(knex, req.params.id);

    //Remove budget members that are not existent in the new members array provided by the client
    await existingBudgetMembers.map((memberId) => {
      if (!newMembersIds.includes(memberId)) {
        removeBudgetMember(knex, req.params.id, memberId);
      }
    });

    //Update budget name
    await knex("budgets")
      .where({ id: req.params.id })
      .update({ name: req.body.name });

    //Get budget
    const budget = await knex("budgets")
      .select("*")
      .where({ id: req.params.id })
      .first();

    //Get budget member ids
    const memberIds = await getBudgetMembers(knex, req.params.id);

    //Get budget usernames for each member withing the budget members
    const budgetMembers = await knex("users")
      .select("username", "id")
      .whereIn("id", memberIds);

    return res.status(200).json({ ...budget, members: budgetMembers });
  } catch (e) {
    return res.status(500).json(e);
  }
};

//Delete budget
const deleteBudget = async (req: Request, res: Response) => {
  //Get user id
  const user_id = req.user_id as string;

  //Validate request params
  if (!isValidRequestParams(req, ["id"]) || !req.params.id) {
    return res.status(400).json("Missing request id param.");
  }

  //Validate if user has owner access to budget
  if (!(await isMemberOfBudget(knex, req.params.id, user_id, "owner"))) {
    return res.status(403).json();
  }

  try {
    //Delete budget by id
    const deletedCount = await knex("budgets")
      .where({ id: req.params.id })
      .delete();

    //If no budget deleted return 404
    if (!deletedCount) {
      return res.status(404).json();
    }

    return res.status(204).json();
  } catch (e) {
    return res.status(500).json(e);
  }
};

export default {
  createBudget,
  getBudget,
  getBudgets,
  editBudget,
  deleteBudget,
};
