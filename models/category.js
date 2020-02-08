'use strict';
module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        name: DataTypes.STRING
    }, {tableName: 'categories'});
    Category.associate = function (models) {
    };
    return Category;
};
