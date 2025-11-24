import cors from 'cors';
import express , { Application, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import "dotenv/config";

const app: Application = express();

const port = process.env.PORT || 8000;

// middlewares 
// FIRST: Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// SECOND: Cookie
app.use(cookieParser());

// THIRD: CORS - FIXED for deployment
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL, // Your deployed frontend URL
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods:['*']
}));

// FOURTH: Other middlewares
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.get('/', (_: Request, res: Response) => {
   res.status(200).json({ message: 'Server is running' });
});

// all routes will be here
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';
import favouriteRoutes from './routes/favourite.routes';

app.use('/api/favourites', favouriteRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
   
});