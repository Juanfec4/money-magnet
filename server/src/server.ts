import "dotenv/config";
import express from "express";
import morgan from "morgan";
import ip from "ip";

import authMiddleware from "./middlewares/auth.middleware";

import budgetRouter from "./routers/budget.router";
import accountRouter from "./routers/account.router";
import transactionRouter from "./routers/transaction.router";
import authRouter from "./routers/auth.router";

import "./config/passport";

const port: string = process.env.PORT || "8080";
const app = express();

app.use(express.json());

app.use("/", morgan("dev"));

//Auth
app.use("/auth", authRouter);

//Middlewares
app.use("/", authMiddleware);

//Routers
app.use("/budgets", budgetRouter);
app.use("/accounts", accountRouter);
app.use("/transactions", transactionRouter);

app.listen(port, () => {
  console.log(`Server started on: http://${ip.address()}:${port}`);
});
