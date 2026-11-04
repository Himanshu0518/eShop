"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Define cart routes here
router.route('/getAll').get(authMiddleware_1.VerifyJWT, cart_controller_1.getCartItems);
router.route('/add').post(authMiddleware_1.VerifyJWT, cart_controller_1.addToCart);
router.route('/remove/:cartItemId').delete(authMiddleware_1.VerifyJWT, cart_controller_1.removeFromCart);
router.route('/update_qty/:cartItemId').put(authMiddleware_1.VerifyJWT, cart_controller_1.setItemQuantity);
exports.default = router;
