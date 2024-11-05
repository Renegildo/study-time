import express from "express";
import dotenv from "dotenv";
import router from "./router";
dotenv.config();

const port = process.env.PORT || 8080;

const app = express();

app.use(router());

app.listen(port, () => {
  console.log(`Api running on port ${port}`);
});
