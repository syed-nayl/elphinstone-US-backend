import { Request, Response, NextFunction } from "express";
import axios from "axios"
import { portfolioSubscriptionSchema } from "../schemas/portfolioSubscriptionSchema";
import Ajv from "ajv";

const baseURL = "https://broker-api.sandbox.alpaca.markets/"
const ajv = new Ajv({strict: false})


export function subscribe(req: Request, res: Response) {
    const payload : object = req.body
    const validate  = ajv.compile(portfolioSubscriptionSchema)
    const valid = validate(payload)
    if (!valid){
        console.log(validate.errors)
        res.send({"errors":validate.errors})
        return
    } 
    axios.post(baseURL+'/v1/rebalancing/subscriptions',payload,{auth:{username:"CKOFCLBDYYHDPORJ7WB4",password:"hAi3yb7ec9MiP6C5fqWklvRb6A8PMdt1GMFgGMY9"}})
    .then((response: any) => {
        console.log(response.data)
        res.send(response.data)  
    })
    .catch((error: any) => {
        console.log(error.response.data);
        res.send(error.response.data)
    });
}

