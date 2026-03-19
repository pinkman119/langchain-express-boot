import { Router } from "express";
import {
  userCreate,
  userDelete,
  userGet,
  userList,
  userUpdate,
  userWeatherByMessage,
} from "../controller/user";

function userRouter() {
  const r = Router();

  r.get("/", wrap(userList));
  r.get("/:id", wrap(userGet));
  r.post("/weather-by-message", wrap(userWeatherByMessage));
  r.post("/", wrap(userCreate));
  r.patch("/:id", wrap(userUpdate));
  r.delete("/:id", wrap(userDelete));

  return r;
}

function wrap(fn: any) {
  return (req: any, res: any, next: any) => Promise.resolve(fn(req, res)).catch(next);
}

export { userRouter };
