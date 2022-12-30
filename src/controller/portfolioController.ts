import { Router } from "express";
import { createAccount } from "../service/accountService";

const portfolioRouter = Router();

portfolioRouter.post("/subscribe", createAccount);

export default portfolioRouter;
