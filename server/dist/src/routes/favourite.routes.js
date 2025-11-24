"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favourite_controller_1 = require("../controllers/favourite.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Define cart routes here
router.route('/getAll').get(authMiddleware_1.VerifyJWT, favourite_controller_1.getAllfavourite);
router.route('/add').post(authMiddleware_1.VerifyJWT, favourite_controller_1.addToFavourite);
router.route('/remove/:favId').delete(authMiddleware_1.VerifyJWT, favourite_controller_1.removeFromFavorite);
router.route('/toggle/:productId').put(authMiddleware_1.VerifyJWT, favourite_controller_1.toggleFavourite);
exports.default = router;
