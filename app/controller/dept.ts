import type { Request, Response } from "express";
import { HttpError } from "../middleware/error_handler";
import { createDept, deleteDept, getDept, listDepts, updateDept } from "../service/dept.service";

function numParam(req: Request, name: string): number {
  const n = Number(req.params[name]);
  if (!Number.isFinite(n)) throw new HttpError(400, `invalid param: ${name}`);
  return n;
}

export async function deptList(req: Request, res: Response) {
  const data = await listDepts();
  res.json({ success: true, data });
}

export async function deptGet(req: Request, res: Response) {
  const id = numParam(req, "id");
  const data = await getDept(id);
  res.json({ success: true, data });
}

export async function deptCreate(req: Request, res: Response) {
  const body = req.body ?? {};
  const parentId = body.parentId ?? body.parent_id;
  const pathIds = body.pathIds ?? body.path_ids;
  const pathNames = body.pathNames ?? body.path_names;
  if (
    body.id == null ||
    body.name == null ||
    parentId == null ||
    pathIds == null ||
    pathNames == null
  ) {
    throw new HttpError(
      400,
      "missing fields: id,name,parentId/pathId,parent_id,pathIds/path_ids,pathNames/path_names",
    );
  }
  const data = await createDept({
    id: Number(body.id),
    name: String(body.name),
    parentId: Number(parentId),
    pathIds,
    pathNames,
  });
  res.status(201).json({ success: true, data });
}

export async function deptUpdate(req: Request, res: Response) {
  const id = numParam(req, "id");
  const body = req.body ?? {};
  const data = await updateDept(id, body);
  res.json({ success: true, data });
}

export async function deptDelete(req: Request, res: Response) {
  const id = numParam(req, "id");
  const data = await deleteDept(id);
  res.json({ success: true, data });
}
