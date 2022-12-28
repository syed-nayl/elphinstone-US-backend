import { Router } from "express"
import { createAccount } from '../service/accountService';

const accountRouter = Router()

accountRouter.post("/createAccount", createAccount )


export default accountRouter 