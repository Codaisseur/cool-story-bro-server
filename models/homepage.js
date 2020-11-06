"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class homepage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      homepage.belongsTo(models.user);
      homepage.hasMany(models.story);
    }
  }
  homepage.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      backgroundColor: {
        type: DataTypes.STRING,
        defaultValue: "#ffffff",
      },
      color: {
        type: DataTypes.STRING,
        defaultValue: "#000000",
      },
    },
    {
      sequelize,
      modelName: "homepage",
    }
  );
  return homepage;
};
