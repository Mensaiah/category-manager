'use strict';
import { Model, ModelStatic } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // define association here
    }
  }
  Category.init({
    name: DataTypes.STRING,
    parentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Categories', 
        key: 'id'
      },
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};