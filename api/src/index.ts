import express from "express";
import dotenv from "dotenv";
import router from "./router";
import cors from "cors";
import { Timer } from "./timer";
dotenv.config();

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());

const timer = new Timer();
app.use("/api", router(timer));

setInterval(() => {
  timer.update();
}, 1000);

app.listen(port, () => {
  console.log(`Api running on port ${port}`);
});
