'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('ProductCategory', {
        productId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Product',
                key: 'id'
            }
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Category',
                key: 'id'
            }
        }
    }, {timestamps: false, tableName: 'product_categories'});
};
