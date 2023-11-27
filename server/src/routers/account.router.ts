import { Router } from "express";
import accountController from "../controllers/account.controller";

const router = Router();

//Get all accounts
router.get("/", (req, res) => {
  return accountController.getAccounts(req, res);
});

//Get account
router.get("/:id", (req, res) => {
  return accountController.getAccount(req, res);
});

//Create account
router.post("/", (req, res) => {
  return accountController.createAccount(req, res);
});

//Edit account
router.patch("/:id", (req, res) => {
  return accountController.editAccount(req, res);
});

//Delete account
router.delete("/:id", (req, res) => {
  return accountController.deleteAccount(req, res);
});

export default router;
