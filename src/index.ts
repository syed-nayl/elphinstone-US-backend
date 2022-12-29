import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import accountRouter from "./controller/accountController";
import portfolioRouter from "./controller/portfolioController";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

/**MIDDLEWARES */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("elphinstone backend, STATUS : OK");
});

/**ROUTES */
app.use("/v1/accounts", accountRouter);
app.use("/v1/portfolio", portfolioRouter);
