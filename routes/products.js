let express = require("express");
const ProductController = require("../controllers/ProductController");

let router = express.Router();


router.get("/", ProductController.productList);
router.get("/category/:category", ProductController.productByCategory);
router.get("/:id", ProductController.productDetail);
/*router.post("/", BookController.bookStore);
router.put("/:id", BookController.bookUpdate);
router.delete("/:id", BookController.bookDelete);
*/

module.exports = router;
