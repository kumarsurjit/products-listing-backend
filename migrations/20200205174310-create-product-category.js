'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('product_categories', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            productId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'products'
                    },
                    key: 'id'
                },
                allowNull: true
            },
            categoryId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'categories'
                    },
                    key: 'id'
                },
                allowNull: true
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('product_categories');
    }
};
