import {Router} from 'express'; 
import {addToCart, getCartItems,removeFromCart , setItemQuantity} from '../controllers/cart.controller';
import { VerifyJWT } from '../middlewares/authMiddleware';


const router = Router();

// Define cart routes here
router.route('/getAll').get(VerifyJWT, getCartItems);

router.route('/add').post(VerifyJWT, addToCart);

router.route('/remove/:cartItemId').delete(VerifyJWT, removeFromCart);

router.route('/update_qty/:cartItemId').put(VerifyJWT, setItemQuantity);

export default router;