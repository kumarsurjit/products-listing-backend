const models = require('../models');
const apiResponse = require('../helpers/apiResponse');

/**
 * Category List
 * @returns {Object}
 */
exports.categoryList = [
    function (request, response) {
        try {
            models.Category.findAll({ attributes: ['id', 'name']})
                .then((categories) => {
                    if (categories.length > 0) {
                        return apiResponse.successResponseWithData(response, 'Operation success', categories);
                    }
                    return apiResponse.successResponseWithData(response, 'Operation success', []);
                });
        } catch (error) {
            return apiResponse.ErrorResponse(response, error);
        }
    }
];
