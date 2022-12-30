import axios from "axios";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();
const baseURL = process.env.BASE_URL;

export function getAllPositionsForAccount(req: Request, res: Response) {
  let account_id = req.params.account_id;
  axios
    .get(baseURL + "/v1/trading/accounts/" + account_id + "/positions", {
      auth: {
        username: process.env.ALPACA_KEY,
        password: process.env.ALPACA_SECRET,
      },
    })
    .then((response: any) => {
      console.log(response.data);
      res.send(response.data);
    })
    .catch((error: any) => {
      console.log(error.response.data);
      res.send(error.response.data);
    });
}
