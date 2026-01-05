import {createOrder,verifyPayment,getAllOrders,getPaymentKey} from '../controllers/order.controller'
import {Router} from 'express'
import {VerifyJWT} from '../middlewares/authMiddleware'
const router = Router();


router.route('/create-order').post(VerifyJWT,createOrder)
router.route("/verify-payment").post(VerifyJWT,verifyPayment);
router.route("/getAll").get(VerifyJWT,getAllOrders);
router.route("/getKey").get(VerifyJWT,getPaymentKey)

export default router