import type { Request, Response } from "express";
import { HttpError } from "../middleware/error_handler";
import { createUser, deleteUser, getUser, listUsers, updateUser } from "../service/user.service";

function numParam(req: Request, name: string): number {
  const n = Number(req.params[name]);
  if (!Number.isFinite(n)) throw new HttpError(400, `invalid param: ${name}`);
  return n;
}

export async function userList(req: Request, res: Response) {
  const data = await listUsers();
  res.json({ success: true, data });
}

export async function userGet(req: Request, res: Response) {
  const id = numParam(req, "id");
  const data = await getUser(id);
  res.json({ success: true, data });
}

export async function userCreate(req: Request, res: Response) {
  const body = req.body ?? {};
  const deptId = body.deptId ?? body.dept_id;
  const nickName = body.nickName ?? body.nick_name;
  if (body.id == null || body.name == null || deptId == null || body.status == null) {
    throw new HttpError(400, "missing fields: id,name,deptId/dept_id,status");
  }
  const data = await createUser({
    id: Number(body.id),
    name: String(body.name),
    deptId: Number(deptId),
    status: Number(body.status),
    avatar: body.avatar == null ? null : String(body.avatar),
    nickName: nickName == null ? null : String(nickName),
  });
  res.status(201).json({ success: true, data });
}

export async function userUpdate(req: Request, res: Response) {
  const id = numParam(req, "id");
  const body = req.body ?? {};
  const data = await updateUser(id, body);
  res.json({ success: true, data });
}

export async function userDelete(req: Request, res: Response) {
  const id = numParam(req, "id");
  const data = await deleteUser(id);
  res.json({ success: true, data });
}
