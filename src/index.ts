import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const dbConnect = require("./config/dbConnect")
const app: Express = express();
const PORT = process.env.PORT;
dbConnect()
app.get('/', (req: Request, res: Response) => {
  res.send('Express + dasdas TypeScript Server');
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
