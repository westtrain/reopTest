"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      models.Tag.belongsTo(models.Palette, {
        foreignKey: "tag_id",
        targetKey: "id",
        onDelete: "cascade",
      });
    }
  }
  Tag.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      IsColorTag: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Tag",
      tableName: "Tags",
    }
  );

  return Tag;
};
