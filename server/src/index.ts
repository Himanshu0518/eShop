import cors from 'cors';
import express , { Application, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import "dotenv/config";

const app: Application = express();


const port = process.env.PORT ;


// middlewares 
// FIRST: Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// SECOND: Cookie
app.use(cookieParser());

// THIRD: CORS
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// FOURTH: Other middlewares
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(helmet());


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