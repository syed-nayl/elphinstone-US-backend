import { Router } from "express"
import { createAccount } from '../service/accountService';

const accountRouter = Router()

accountRouter.post("/", createAccount )

export default accountRouter 