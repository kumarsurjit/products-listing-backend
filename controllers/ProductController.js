const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const models = require('../models');

/**
 * Product List.
 *
 * @returns {Object}
 */
exports.productList = [
    function (request, response) {
        try {
            models.Product.findAll({
                include: [{
                    model: models.Category,
                    as: 'categories',
                    attributes: ['id', 'name'],
                    through: { attributes: []}
                }]
            }).then((products)=>{
                if (products.length > 0){
                    return apiResponse.successResponseWithData(response, "Operation success", products);
                }
                return apiResponse.successResponseWithData(response, "Operation success", []);
            });
        } catch (error) {
            //throw error in json response with status 500.
            return apiResponse.ErrorResponse(response, error);
        }
    }
];

/**
 * Product List by category.
 *
 * @returns {Object}
 */
exports.productByCategory = [
    function (request, response) {
        try {
            const {category} = request.params;
            if (isNaN(category)) {
                return apiResponse.validationErrorWithData(response, 'Invalid request', {});
            }
            models.Product.findAll({
                include: [{
                    model: models.Category,
                    as: 'categories',
                    attributes: ['id', 'name'],
                    through: { attributes: []},
                    where: { id: category}
                }]
            }).then((products)=>{
                if (products.length > 0){
                    return apiResponse.successResponseWithData(response, "Operation success", products);
                }
                return apiResponse.successResponseWithData(response, "Operation success", []);
            });
        } catch (error) {
            //throw error in json response with status 500.
            return apiResponse.ErrorResponse(response, error);
        }
    }
];

/**
 * Product Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.productDetail = [
    function (request, response) {
        const productId = request.params.id;
        if (isNaN(productId)) {
            return apiResponse.validationErrorWithData(response, 'Invalid request', {});
        }
        try {
            models.Product.findByPk(productId).then((product)=>{
                if (product) {
                    return apiResponse.successResponseWithData(response, 'Operation success', product);
                }
                return apiResponse.notFoundResponse(response, 'Product not found');
            });
        } catch (error) {
            //throw error in json response with status 500.
            return apiResponse.ErrorResponse(response, error);
        }
    }
];

/**
/**
 * Book store.
 *
 * @param {string}      title
 * @param {string}      description
 * @param {string}      isbn
 *
 * @returns {Object}
 *!/
exports.bookStore = [
    auth,
    body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
    body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
    body("isbn", "ISBN must not be empty").isLength({ min: 1 }).trim().custom((value,{req}) => {
        return Book.findOne({isbn : value,user: req.user._id}).then(book => {
            if (book) {
                return Promise.reject("Book already exist with this ISBN no.");
            }
        });
    }),
    sanitizeBody("*").escape(),
    (req, res) => {
        try {
            const errors = validationResult(req);
            var book = new Book(
                { title: req.body.title,
                    user: req.user,
                    description: req.body.description,
                    isbn: req.body.isbn
                });

            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
            }
            else {
                //Save book.
                book.save(function (err) {
                    if (err) { return apiResponse.ErrorResponse(res, err); }
                    let bookData = new BookData(book);
                    return apiResponse.successResponseWithData(res,"Book add Success.", bookData);
                });
            }
        } catch (err) {
            //throw error in json response with status 500.
            return apiResponse.ErrorResponse(res, err);
        }
    }
];

/**
 * Book update.
 *
 * @param {string}      title
 * @param {string}      description
 * @param {string}      isbn
 *
 * @returns {Object}
 *!/
exports.bookUpdate = [
    auth,
    body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
    body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
    body("isbn", "ISBN must not be empty").isLength({ min: 1 }).trim().custom((value,{req}) => {
        return Book.findOne({isbn : value,user: req.user._id, _id: { "$ne": req.params.id }}).then(book => {
            if (book) {
                return Promise.reject("Book already exist with this ISBN no.");
            }
        });
    }),
    sanitizeBody("*").escape(),
    (req, res) => {
        try {
            const errors = validationResult(req);
            var book = new Book(
                { title: req.body.title,
                    description: req.body.description,
                    isbn: req.body.isbn,
                    _id:req.params.id
                });

            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
            }
            else {
                if(!mongoose.Types.ObjectId.isValid(req.params.id)){
                    return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
                }else{
                    Book.findById(req.params.id, function (err, foundBook) {
                        if(foundBook === null){
                            return apiResponse.notFoundResponse(res,"Book not exists with this id");
                        }else{
                            //Check authorized user
                            if(foundBook.user.toString() !== req.user._id){
                                return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
                            }else{
                                //update book.
                                Book.findByIdAndUpdate(req.params.id, book, {},function (err) {
                                    if (err) {
                                        return apiResponse.ErrorResponse(res, err);
                                    }else{
                                        let bookData = new BookData(book);
                                        return apiResponse.successResponseWithData(res,"Book update Success.", bookData);
                                    }
                                });
                            }
                        }
                    });
                }
            }
        } catch (err) {
            //throw error in json response with status 500.
            return apiResponse.ErrorResponse(res, err);
        }
    }
];

/!**
 * Book Delete.
 *
 * @param {string}      id
 *
 * @returns {Object}
 *!/
exports.bookDelete = [
    auth,
    function (req, res) {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
        }
        try {
            Book.findById(req.params.id, function (err, foundBook) {
                if(foundBook === null){
                    return apiResponse.notFoundResponse(res,"Book not exists with this id");
                }else{
                    //Check authorized user
                    if(foundBook.user.toString() !== req.user._id){
                        return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
                    }else{
                        //delete book.
                        Book.findByIdAndRemove(req.params.id,function (err) {
                            if (err) {
                                return apiResponse.ErrorResponse(res, err);
                            }else{
                                return apiResponse.successResponse(res,"Book delete Success.");
                            }
                        });
                    }
                }
            });
        } catch (err) {
            //throw error in json response with status 500.
            return apiResponse.ErrorResponse(res, err);
        }
    }
];
*/
