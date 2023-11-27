import { Router } from "express";
import authController from "../controllers/auth.controller";

const router = Router();

//Login
router.post("/login", (req, res) => {
  return authController.loginUser(req, res);
});

//Register
router.post("/register", (req, res) => {
  return authController.registerUser(req, res);
});
export default router;
