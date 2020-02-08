const express = require("express");
const router = express.Router();
const apiResponse = require("../helpers/apiResponse");

/* GET home page. */
router.get("/", function (req, res) {
    return apiResponse.successResponse(res, 'Welcome');
});

module.exports = router;
