import { Dept, User } from "../model/_index";
import { HttpError } from "../middleware/error_handler";

type UserCreateInput = {
  id: number;
  name: string;
  deptId: number;
  status: number;
  belongPlace: number;
  nickName?: string | null;
};

type UserUpdateInput = Partial<Omit<UserCreateInput, "id">>;

async function listUsers() {
  // prettier-ignore
  return User.findAll({
    order  : [["id", "ASC"]],
    include: [{ model: Dept, as: "dept" }],
  });
}

async function getUser(id: number) {
  const user = await User.findByPk(id, { include: [{ model: Dept, as: "dept" }] });
  if (!user) throw new HttpError(404, "user not found");
  return user;
}

async function createUser(input: UserCreateInput) {
  const exists = await User.findByPk(input.id);
  if (exists) throw new HttpError(409, "user id already exists");
  // prettier-ignore
  return User.create({
    id      : input.id,
    name    : input.name,
    deptId  : input.deptId,
    status  : input.status,
    belongPlace  : input.belongPlace,
    nickName: input.nickName ?? null,
  } as any);
}

async function updateUser(id: number, patch: UserUpdateInput) {
  const user = await getUser(id);
  // prettier-ignore
  await user.update({
    ...patch,
    belongPlace  : patch.belongPlace,
    nickName: patch.nickName === undefined ? user.nickName : patch.nickName,
  } as any);
  return getUser(id);
}

async function deleteUser(id: number) {
  const user = await getUser(id);
  await user.destroy();
  return { deleted: true };
}

export type { UserCreateInput, UserUpdateInput };
export { createUser, deleteUser, getUser, listUsers, updateUser };
