import { Dept } from "../model/_index";
import { HttpError } from "../middleware/error_handler";

export type DeptCreateInput = {
  id: number;
  name: string;
  parentId: number;
  pathIds: unknown;
  pathNames: unknown;
};

export type DeptUpdateInput = Partial<Omit<DeptCreateInput, "id">>;

export async function listDepts() {
  return Dept.findAll({ order: [["id", "ASC"]] });
}

export async function getDept(id: number) {
  const dept = await Dept.findByPk(id);
  if (!dept) throw new HttpError(404, "dept not found");
  return dept;
}

export async function createDept(input: DeptCreateInput) {
  const exists = await Dept.findByPk(input.id);
  if (exists) throw new HttpError(409, "dept id already exists");
  return Dept.create(input as any);
}

export async function updateDept(id: number, patch: DeptUpdateInput) {
  const dept = await getDept(id);
  await dept.update(patch as any);
  return dept;
}

export async function deleteDept(id: number) {
  const dept = await getDept(id);
  await dept.destroy();
  return { deleted: true };
}
