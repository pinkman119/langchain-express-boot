import { Router } from "express";
import { deptCreate, deptDelete, deptGet, deptList, deptUpdate } from "../controller/dept";

export function deptRouter() {
  const r = Router();

  r.get("/", wrap(deptList));
  r.get("/:id", wrap(deptGet));
  r.post("/", wrap(deptCreate));
  r.patch("/:id", wrap(deptUpdate));
  r.delete("/:id", wrap(deptDelete));

  return r;
}

function wrap(fn: any) {
  return (req: any, res: any, next: any) => Promise.resolve(fn(req, res)).catch(next);
}
