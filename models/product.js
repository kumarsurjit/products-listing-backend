'use strict';
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        price: DataTypes.DOUBLE
    }, {tableName: 'products'});
    Product.associate = function (models) {
        Product.belongsToMany(models.Category, {
            through: 'ProductCategory',
            as: 'categories',
            foreignKey: 'productId'
        });
    };
    return Product;
};
