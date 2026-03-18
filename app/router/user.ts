import { Router } from "express";
import { userCreate, userDelete, userGet, userList, userUpdate } from "../controller/user";

export function userRouter() {
  const r = Router();

  r.get("/", wrap(userList));
  r.get("/:id", wrap(userGet));
  r.post("/", wrap(userCreate));
  r.patch("/:id", wrap(userUpdate));
  r.delete("/:id", wrap(userDelete));

  return r;
}

function wrap(fn: any) {
  return (req: any, res: any, next: any) => Promise.resolve(fn(req, res)).catch(next);
}
