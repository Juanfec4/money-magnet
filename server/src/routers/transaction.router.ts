import { Router } from "express";
import transactionController from "../controllers/transaction.controller";

const router = Router();

//Get all transactions
router.get("/", (req, res) => {
  return transactionController.getTransactions(req, res);
});

//Get transaction
router.get("/:id", (req, res) => {
  return transactionController.getTransaction(req, res);
});

//Create transaction
router.post("/", (req, res) => {
  return transactionController.createTransaction(req, res);
});

//Edit transaction
router.patch("/:id", (req, res) => {
  return transactionController.editTransaction(req, res);
});

//Delete transaction
router.delete("/:id", (req, res) => {
  return transactionController.deleteTransaction(req, res);
});

export default router;
