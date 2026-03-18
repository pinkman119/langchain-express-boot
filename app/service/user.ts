import { Dept, User } from "../model/_index";
import { HttpError } from "../middleware/error_handler";

export type UserCreateInput = {
  id: number;
  name: string;
  deptId: number;
  status: number;
  avatar?: string | null;
  nickName?: string | null;
};

export type UserUpdateInput = Partial<Omit<UserCreateInput, "id">>;

export async function listUsers() {
  // prettier-ignore
  return User.findAll({
    order  : [["id", "ASC"]],
    include: [{ model: Dept, as: "dept" }],
  });
}

export async function getUser(id: number) {
  const user = await User.findByPk(id, { include: [{ model: Dept, as: "dept" }] });
  if (!user) throw new HttpError(404, "user not found");
  return user;
}

export async function createUser(input: UserCreateInput) {
  const exists = await User.findByPk(input.id);
  if (exists) throw new HttpError(409, "user id already exists");
  // prettier-ignore
  return User.create({
    id      : input.id,
    name    : input.name,
    deptId  : input.deptId,
    status  : input.status,
    avatar  : input.avatar ?? null,
    nickName: input.nickName ?? null,
  } as any);
}

export async function updateUser(id: number, patch: UserUpdateInput) {
  const user = await getUser(id);
  // prettier-ignore
  await user.update({
    ...patch,
    avatar  : patch.avatar === undefined ? user.avatar : patch.avatar,
    nickName: patch.nickName === undefined ? user.nickName : patch.nickName,
  } as any);
  return getUser(id);
}

export async function deleteUser(id: number) {
  const user = await getUser(id);
  await user.destroy();
  return { deleted: true };
}
