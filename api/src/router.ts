import { Router } from "express";
import { Timer } from "./timer";

export default (timer: Timer, broadcast: (message: string) => void) => {
  const router = Router();

  router.post("/focus", (_req, res) => {
    timer.focus();
    broadcast("focus");
    res.sendStatus(200);
  });

  router.post("/break", (_req, res) => {
    timer.break();
    broadcast("break");
    res.sendStatus(200);
  });

  router.post("/reset", (_req, res) => {
    timer.reset();
    res.sendStatus(200);
  })

  router.post("/pause", (_req, res) => {
    timer.pause();
    broadcast("pause");
    res.sendStatus(200);
  });

  router.post("/resume", (_req, res) => {
    timer.resume();
    broadcast("resume");
    res.sendStatus(200);
  });

  router.get("/status", (_req, res) => {
    const status = timer.status();

    res.json({ ...status });
  });

  return router;
};
