import { getAll } from "@alpacahq/alpaca-trade-api/dist/resources/position";
import { Router } from "express";
import { getAllPositionsForAccount } from "../service/tradingService";

const tradingRouter = Router();

tradingRouter.post("/getAllPositions", getAllPositionsForAccount);

export default tradingRouter;
