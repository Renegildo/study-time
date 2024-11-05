import { Router } from "express";
import { Timer } from "./timer";

export default (timer: Timer) => {
  const router = Router();

  router.post("/focus", (_req, res) => {
    timer.focus();
    res.sendStatus(200);
  });

  router.post("/break", (_req, res) => {
    timer.break();
    res.sendStatus(200);
  });

  router.get("/status", (_req, res) => {
    const status = timer.status();

    res.json({ ...status });
  });

  return router;
};
