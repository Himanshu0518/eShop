import { Router } from "express";
import { getAllProducts,
  updateProduct,
  deleteProduct,
  addProduct,
  getProductById, 
  bulkAddWordEmbeddings,
  addProductView,
  getProductViews,
  addWordEmbedding,
} from "../controllers/product.controller";
  import { getReccomendationByProduct,getRecommendationByQuery,getRecommendationByUserHistory } from "../controllers/recommendation.controller";
import { VerifyJWT } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/multerMiddleware";
import { ValidateProductAddition } from "../middlewares/Validation";

const router = Router();

// Define product routes here
router.route('/getAll').get( getAllProducts);

router.route('/get/:id').get(getProductById);

router.route('/update/:id')
 .put(VerifyJWT,
    upload.single('img'),
    updateProduct);

router.route('/delete/:id').delete(VerifyJWT, deleteProduct);

router.route('/add')
.post(
  VerifyJWT, 
  upload.single('img'),  
  ValidateProductAddition,
  addProduct
);

router.route('/addView/:productId').post(VerifyJWT,addProductView);
router.route('/getViews').get(VerifyJWT,getProductViews);

router.route('/addEmbedding').post(VerifyJWT,addWordEmbedding);

router.route('/embeddings/bulk').post(bulkAddWordEmbeddings);

router.route('/getrecommendations/:productId').get(getReccomendationByProduct);

router.route('/getrecommendations').get(getRecommendationByQuery);

router.route('/getuserrecommendations').get(VerifyJWT,getRecommendationByUserHistory);
export default router;