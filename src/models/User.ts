import {  DataTypes, Model, Optional,  } from "sequelize";
import sequelize from "../config/database";


 interface UserAtributes {
    id: number, 
    username: string,
    email: string, 
    password: string
}

// Some attributes are optional in `User.build` and `User.create` calls
type UserCreationAttributes = Optional<UserAtributes, "id">

class User extends Model<UserAtributes, UserCreationAttributes>
  implements UserAtributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public username!: string;
  public email!: string; 
  public password!: string;
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
        allowNull: false
      }
    },
    {
      tableName: "users",
      sequelize, // passing the `sequelize` instance is required
    }
  );

/*
CREATE TABLE `myteam`.`users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE);


*/

export default User
