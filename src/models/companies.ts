import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Profile from "./Profile";
import User from "./User";

interface CompanyAttributes {
    name: string;
    logo: string;
    slug: string;
    id: number;
    companyOwner: number;
}

// Some attributes are optional in `User.build` and `User.create` calls
//type UserCreationAttributes = Optional<UserAtributes, "id">
type CompanyCreationalAttributes = Optional<CompanyAttributes, "id">;

class Company
    extends Model<CompanyAttributes, CompanyCreationalAttributes>
    implements CompanyAttributes
{
    public name!: string; // Note that the `null assertion` `!` is required in strict mode.
    public logo!: string;
    public readonly id!: number;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public slug!: string;
    public companyOwner!: number;
}

Company.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            unique: true,
        },
        name: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        logo: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },

        slug: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        companyOwner: {
            type: new DataTypes.INTEGER().UNSIGNED,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },
    },

    {
        tableName: "companies",
        sequelize, // passing the `sequelize` instance is required
    }
);
Company.hasMany(Profile, { foreignKey: "company" });
Profile.belongsTo(Company);

User.hasMany(Company, { foreignKey: "companyOwner" });
Company.belongsTo(User);
export default Company;
