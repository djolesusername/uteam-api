import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import User from "./User";
import { Status } from "../types/types";

interface ProfileAttributes {
    name: string;
    profilePhoto: string;
    status: Status;
    user: number;
}

// Some attributes are optional in `User.build` and `User.create` calls
//type UserCreationAttributes = Optional<UserAtributes, "id">

class Profile extends Model<ProfileAttributes> implements ProfileAttributes {
    public name!: string; // Note that the `null assertion` `!` is required in strict mode.
    public profilePhoto!: string;
    public status!: Status;
    public readonly user!: number;
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Profile.init(
    {
        name: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        profilePhoto: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        status: {
            type: new DataTypes.ENUM(...Object.values(Status)),
            allowNull: false,
        },
        user: {
            type: DataTypes.INTEGER.UNSIGNED,
            unique: true,
            allowNull: false,
            references: {
                // 1:1
                model: "users",
                key: "id",
            },
        },
    },
    {
        tableName: "profiles",
        sequelize, // passing the `sequelize` instance is required
    }
);
Profile.belongsTo(User, { targetKey: "id" });
User.hasOne(Profile, { sourceKey: "id" });

export default Profile;
