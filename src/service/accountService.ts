import Ajv from "ajv";
import { Request, Response, NextFunction, response } from "express";
import axios from "axios";
import { accountCreationSchema } from "../schemas/accountCreationSchema";
import AWS from "aws-sdk";
import dotenv from "dotenv";

const baseURL = "https://broker-api.sandbox.alpaca.markets/";
const ajv = new Ajv({ strict: false });
dotenv.config();

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const S3_BUCKET = process.env.BUCKET_NAME;
const REGION = process.env.REGION;
const URL_EXPIRATION_TIME = 60; // in seconds

console.log("S3BUCKET", S3_BUCKET);

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

async function generatePreSignedPutUrl(fileName: string) {
  return await myBucket.getSignedUrl("getObject", {
    Key: fileName,
    Expires: URL_EXPIRATION_TIME,
  });
}

async function downloadPDF(pdfURL: string) {
  let pdfBuffer = await axios.get(pdfURL, {
    headers: { "Content-Type": "application/pdf" },
  });
  return pdfBuffer;
}

export async function createAccount(req: Request, res: Response) {
  const payload: object = req.body;
  const validate = ajv.compile(accountCreationSchema);
  const valid = validate(payload);
  if (!valid) {
    console.log(validate.errors);
    res.send({ errors: validate.errors });
    return;
  }

  let obj = JSON.parse(JSON.stringify(payload));

  let conversion_promises: any[] = [];
  let conversion_promises2: any[] = [];
  let converted_objs: any[] = [];
  let converted_objs2: any[] = [];

  let presignurl_promises: any[] = [];
  let presignurls: any[] = [];

  obj.documents.map((document: any) => {
    presignurl_promises.push(generatePreSignedPutUrl(document.content));
  });

  await Promise.all(presignurl_promises).then((response) => {
    presignurls = response;
  });

  presignurls.map((url: string) => {
    conversion_promises2.push(downloadPDF(url));
  });

  await Promise.all(conversion_promises2).then((response) => {
    converted_objs2 = response;
  });

  // obj.documents[0].content = console.log(new Buffer(converted_objs2[0].data).toString(
  //   "base64"
  // );)

  // console.log(new Buffer(converted_objs2[0].data).toString("base64"));

  //   console.log(converted_objs2[0].data);
  //   converted_objs2.map((document: any) => {
  //     conversion_promises.push(pdf2base64(document.data));
  //   });
  //   console.log("Hiiii");
  //   await Promise.all(conversion_promises).then((response) => {
  //     converted_objs = response;
  //   });

  //   for (let i = 0; i < obj.documents.length; i++) {
  //     obj.documents[i].content = converted_objs2[i].toString("base64");
  //   }

  res.send(obj);

  // console.log(obj);

  // AWS Fetching Part
  // const BUCKET = 'smartinvest-documents-bucket-local';

  // // @typescript-eslint/unsafe-assignment
  // payload.documents[0].content = CNICB64

  //   axios.post(baseURL + "v1/accounts", payload, {
  //     auth: {
  //
  //     },
  //   });
  // .then((response: any) => {
  //     console.log(response.data)
  //     res.send(response.data)
  // })
  // .catch((error: any) => {
  //     console.log(error.response.data);
  //     res.send(error.response.data)
  // });
}
