import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

import authRouter from './routes/authRoute'

const dbConnect = require("./config/dbConnect")
const app: Express = express();
const PORT = process.env.PORT;
dbConnect()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use('/api/user', authRouter)

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
