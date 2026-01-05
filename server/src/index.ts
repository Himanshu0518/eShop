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


app.use(cookieParser());

// THIRD: CORS - FIXED for both AWS and Render/Vercel
const allowedOrigins = [
  'http://localhost',
  'http://localhost:5173',
  'http://13.49.244.25', // AWS EC2 IP
  'http://ec2-13-49-244-25.eu-north-1.compute.amazonaws.com', // AWS EC2 hostname
  process.env.CLIENT_URL, // Vercel URL will come from env
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(allowed => origin?.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

app.use(express.static("public"));
app.use(morgan("dev"));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.get('/', (_: Request, res: Response) => {
   res.status(200).json({ message: 'Server is running' });
});

app.get('/health', (_: Request, res: Response) => {
   res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// all routes will be here
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';
import favouriteRoutes from './routes/favourite.routes';
import orderRoutes from './routes/order.routes';


app.use('/api/orders', orderRoutes);
app.use('/api/favourites', favouriteRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
   
});
