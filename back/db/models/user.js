module.exports = function (connection) {
  const { DataTypes, Model } = require("sequelize");

  class User extends Model {}

  User.init(
    {
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      tableName: "users",
      sequelize: connection,
      timestamps: false
    }
  );


  return User;
};