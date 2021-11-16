"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Palette extends Model {
    static associate(models) {
      models.Palette.belongsToMany(models.User, {
        through: "Likes",
        foreignKey: "palette_id",
      });
      models.Palette.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
        onDelete: "cascade",
      });
      models.Palette.belongsToMany(models.Tag, {
        through: "Tag_palette",
        foreignKey: "palette_id",
      });
    }
  }
  Palette.init(
    {
      color1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      color2: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      color3: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      color4: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Palette",
      tableName: "Palettes",
    }
  );

  return Palette;
};
