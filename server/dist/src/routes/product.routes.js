"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const multerMiddleware_1 = require("../middlewares/multerMiddleware");
const Validation_1 = require("../middlewares/Validation");
const router = (0, express_1.Router)();
// Define product routes here
router.route('/getAll').get(product_controller_1.getAllProducts);
router.route('/get/:id').get(product_controller_1.getProductById);
router.route('/update/:id')
    .put(authMiddleware_1.VerifyJWT, multerMiddleware_1.upload.single('img'), product_controller_1.updateProduct);
router.route('/delete/:productId').delete(authMiddleware_1.VerifyJWT, product_controller_1.deleteProduct);
router.route('/add')
    .post(authMiddleware_1.VerifyJWT, multerMiddleware_1.upload.single('img'), Validation_1.ValidateProductAddition, product_controller_1.addProduct);
exports.default = router;
