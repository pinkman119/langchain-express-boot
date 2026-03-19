import { Dept, User } from "../model/_index";
import { HttpError } from "../middleware/error_handler";
import { enums } from "../../config/enums";
import { extractEmployeeNickName, getWeatherByCity } from "../../agent/service/weather";

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

async function getWeatherByMessage(message: string): Promise<{
  nickName: string;
  city: string;
  weatherMessage: string;
}> {
  const nickName = (await extractEmployeeNickName(message))?.trim() ?? "";
  if (!nickName) {
    throw new HttpError(400, "could not extract employee nickname");
  }
  const user = await User.findOne({ where: { nickName } });
  if (!user) {
    throw new HttpError(404, "user not found");
  }
  const belongPlace = Number(user.belongPlace);
  const entry = Object.values(enums.USER.BELONG_PLACE_TO_CITY).find(
    (e) => (e as { value: number }).value === belongPlace,
  );
  const city = entry && typeof (entry as { getKey: () => string }).getKey === "function"
    ? (entry as { getKey: () => string }).getKey()
    : "";
  if (!city) {
    throw new HttpError(400, `belong_place ${belongPlace} has no city mapping`);
  }
  let weatherMessage: string;
  try {
    weatherMessage = await getWeatherByCity(city);
  } catch {
    throw new HttpError(502, "weather service unavailable");
  }
  return { nickName, city, weatherMessage };
}

export type { UserCreateInput, UserUpdateInput };
export { createUser, deleteUser, getWeatherByMessage, getUser, listUsers, updateUser };
