import express from "express";
import dotenv from "dotenv";
import router from "./router";
import { Timer } from "./timer";
dotenv.config();

const port = process.env.PORT || 8080;
const app = express();

const timer = new Timer();
app.use(router(timer));

app.listen(port, () => {
  console.log(`Api running on port ${port}`);
});
