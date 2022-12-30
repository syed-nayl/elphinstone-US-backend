import Ajv from "ajv";
import { Request, Response, NextFunction, response } from "express";
import axios from "axios";
import { accountCreationSchema } from "../schemas/accountCreationSchema";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const baseURL = process.env.BASE_URL;
const ajv = new Ajv({ strict: false });
const S3_BUCKET = process.env.BUCKET_NAME;
const REGION = process.env.REGION;
const URL_EXPIRATION_TIME = 60; // seconds
const uri = process.env.MONGO_URI;
const mongoClient = new MongoClient(uri);

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

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
  return await axios.get(pdfURL, {
    // responseType: "arraybuffer",
    responseEncoding: "binary",
  });
}

export async function createAccount(req: Request, res: Response) {
  const payload = req.body;
  const validate = ajv.compile(accountCreationSchema);
  const valid = validate(payload);
  if (!valid) {
    console.log(validate.errors);
    res.send({ errors: validate.errors });
    return;
  }

  let obj = JSON.parse(JSON.stringify(payload));

  let presignurl_promises: any[] = []; // what would the type be here?
  let presignurls: string[] = [];

  let pdfsArray: any[] = [];
  let pdfsPromisesArray: any[] = [];

  obj.documents.map((document: any) => {
    presignurl_promises.push(generatePreSignedPutUrl(document.content));
  });

  await Promise.all(presignurl_promises).then((response) => {
    presignurls = response;
  });

  presignurls.map((url: string) => {
    pdfsPromisesArray.push(downloadPDF(url));
  });

  await Promise.all(pdfsPromisesArray).then((response) => {
    pdfsArray = response;
  });

  let pdf2base64: string[] = [];

  pdfsArray.map((files: any) => {
    pdf2base64.push(Buffer.from(files.data, "binary").toString("base64"));
  });

  for (let i = 0; i < obj.documents.length; i++) {
    obj.documents[i].content = pdf2base64[i];
  }

  let db = mongoClient.db("smart-invest");
  let collection = db.collection("accounts");

  axios
    .post(baseURL + "v1/accounts", obj, {
      auth: {
        username: process.env.ALPACA_KEY,
        password: process.env.ALPACA_SECRET,
      },
    })
    .then((response: any) => {
      try {
        collection.insertOne({ alpaca_account: response.data });
      } catch (error) {
        console.log(error);
      }
      res.send(response.data);
    })
    .catch((error: any) => {
      res.send(error.response.data);
    });
}
