"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const recommendation_controller_1 = require("../controllers/recommendation.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const multerMiddleware_1 = require("../middlewares/multerMiddleware");
const Validation_1 = require("../middlewares/Validation");
const router = (0, express_1.Router)();
// Define product routes here
router.route('/getAll').get(product_controller_1.getAllProducts);
router.route('/get/:id').get(product_controller_1.getProductById);
router.route('/update/:id')
    .put(authMiddleware_1.VerifyJWT, multerMiddleware_1.upload.single('img'), product_controller_1.updateProduct);
router.route('/delete/:id').delete(authMiddleware_1.VerifyJWT, product_controller_1.deleteProduct);
router.route('/add')
    .post(authMiddleware_1.VerifyJWT, multerMiddleware_1.upload.single('img'), Validation_1.ValidateProductAddition, product_controller_1.addProduct);
router.route('/addView/:productId').post(authMiddleware_1.VerifyJWT, product_controller_1.addProductView);
router.route('/getViews').get(authMiddleware_1.VerifyJWT, product_controller_1.getProductViews);
router.route('/addEmbedding').post(authMiddleware_1.VerifyJWT, product_controller_1.addWordEmbedding);
router.route('/embeddings/bulk').post(product_controller_1.bulkAddWordEmbeddings);
router.route('/getrecommendations/:productId').get(recommendation_controller_1.getReccomendationByProduct);
router.route('/getrecommendations').get(recommendation_controller_1.getRecommendationByQuery);
router.route('/getuserrecommendations').get(authMiddleware_1.VerifyJWT, recommendation_controller_1.getRecommendationByUserHistory);
exports.default = router;
