import { Router } from "express";
import budgetController from "../controllers/budget.controller";

const router = Router();

//Get all budgets
router.get("/", (req, res) => {
  return budgetController.getBudgets(req, res);
});

//Get budget
router.get("/:id", (req, res) => {
  return budgetController.getBudget(req, res);
});

//Create budget
router.post("/", (req, res) => {
  return budgetController.createBudget(req, res);
});

//Edit budget
router.patch("/:id", (req, res) => {
  return budgetController.editBudget(req, res);
});

//Delete budget
router.delete("/:id", (req, res) => {
  return budgetController.deleteBudget(req, res);
});

export default router;
