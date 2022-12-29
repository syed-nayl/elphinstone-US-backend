import Ajv from "ajv";
import { Request, Response, NextFunction, response } from "express";
import axios from "axios";
import { accountCreationSchema } from "../schemas/accountCreationSchema";
import AWS from "aws-sdk";

const baseURL = "https://broker-api.sandbox.alpaca.markets/";
const ajv = new Ajv({ strict: false });

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const S3_BUCKET = process.env.BUCKET_NAME;
const REGION = process.env.REGION;
const URL_EXPIRATION_TIME = 60; // in seconds

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

function generatePreSignedPutUrl(fileName: string) {
  myBucket.getSignedUrl(
    "getObject",
    {
      Key: fileName,
      ContentType: "application/pdf",
      Expires: URL_EXPIRATION_TIME,
    },
    (err: Error, url: string) => {
      return url; // API Response Here
    }
  );
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

  // obj.documents.map((document: any) => {
  //   conversion_promises2.push(downloadPDF(document.content));
  // });

  // await Promise.all(conversion_promises2).then((response) => {
  //   converted_objs2 = response;
  // });

  // obj.documents[0].content = new Buffer(converted_objs2[0].data).toString(
  //   "base64"
  // );

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
  //       username: "CKOFCLBDYYHDPORJ7WB4",
  //       password: "hAi3yb7ec9MiP6C5fqWklvRb6A8PMdt1GMFgGMY9",
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
