import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../../config/_index";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: number;
  declare name: string;
  declare deptId: number;
  declare status: number;
  declare avatar: string | null;
  declare nickName: string | null;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    deptId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "dept_id",
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    nickName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "nick_name",
    },
  },
  {
    sequelize,
    tableName: "tbl_user",
    timestamps: false,
    underscored: false,
  },
);
