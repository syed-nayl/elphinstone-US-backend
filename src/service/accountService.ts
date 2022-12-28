import Ajv from "ajv";
import { Request, Response, NextFunction } from "express";
import axios from "axios"
import { accountCreationSchema } from "../schemas/accountCreationSchema";

const baseURL = "https://broker-api.sandbox.alpaca.markets/"
const ajv = new Ajv({strict: false})
const AWS = require('aws-sdk');
const pdf2base64 = require('pdf-to-base64');

export function createAccount(req: Request, res: Response) {
    const payload : object = req.body
    const validate  = ajv.compile(accountCreationSchema)
    const valid = validate(payload)
    if (!valid){
        console.log(validate.errors)
        res.send({"errors":validate.errors})
        return
    } 
    
    // const s3 = new AWS.S3({
    //     accessKeyId: "AKIAX2H4E4J7LMICHKWF",
    //     secretAccessKey: "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",
    // });
        
    // const BUCKET = 'smartinvest-documents-bucket-local';

    var CNICB64 = ""
    var BankStatementB64 = "" 


    pdf2base64((payload as any).documents[0].content)
    .then(
        (response : any) => {
            CNICB64 = response
        }
    )
    .catch(
        (error : any) => {
            console.log(error);
        }
    )

    pdf2base64((payload as any).documents[1].content)
    .then(
        (response:any) => {
            BankStatementB64 = response
            console.log(BankStatementB64)
        }
    )
    .catch(
        (error:any) => {
            console.log(error); 
        }
    )

    // @typescript-eslint/unsafe-assignment
    payload.documents[0].content = CNICB64
    

    axios.post(baseURL+'v1/accounts',payload,{auth:{username:"CKOFCLBDYYHDPORJ7WB4",password:"hAi3yb7ec9MiP6C5fqWklvRb6A8PMdt1GMFgGMY9"}})
    .then((response: any) => {
        console.log(response.data)
        res.send(response.data)  
    })
    .catch((error: any) => {
        console.log(error.response.data);
        res.send(error.response.data)
    });

}

