import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { UserRole } from "../types/types";

interface UserAtributes {
    id: number;
    username: string;
    email: string;
    password: string;
    role: UserRole;
}

// Some attributes are optional in `User.build` and `User.create` calls
type UserCreationAttributes = Optional<UserAtributes, "id">;

class User
    extends Model<UserAtributes, UserCreationAttributes>
    implements UserAtributes
{
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public username!: string;
    public email!: string;
    public password!: string;
    public role!: UserRole;
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            unique: true,
        },
        username: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        email: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        password: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        role: {
            type: new DataTypes.ENUM(...Object.values(UserRole)),
            allowNull: false,
        },
    },

    {
        tableName: "users",
        sequelize, // passing the `sequelize` instance is required
    }
);

export default User;
