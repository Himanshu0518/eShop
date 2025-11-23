import {Router} from 'express'; 
import {getAllfavourite, toggleFavourite, removeFromFavorite,addToFavourite} from '../controllers/favourite.controller';
import { VerifyJWT } from '../middlewares/authMiddleware';

const router = Router();

// Define cart routes here
router.route('/getAll').get(VerifyJWT,getAllfavourite );

router.route('/add').post(VerifyJWT,addToFavourite );

router.route('/remove/:favId').delete(VerifyJWT,removeFromFavorite );

router.route('/toggle/:productId').put(VerifyJWT,toggleFavourite );

export default router;
