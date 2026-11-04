"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
// middlewares 
// FIRST: Body parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
// THIRD: CORS - FIXED for both AWS and Render/Vercel
const allowedOrigins = [
    'http://localhost',
    'http://localhost:5173',
    'http://13.49.244.25', // AWS EC2 IP
    'http://ec2-13-49-244-25.eu-north-1.compute.amazonaws.com', // AWS EC2 hostname
    process.env.CLIENT_URL, // Vercel URL will come from env
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(allowed => origin?.startsWith(allowed))) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));
app.use(express_1.default.static("public"));
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.get('/', (_, res) => {
    res.status(200).json({ message: 'Server is running' });
});
app.get('/health', (_, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// all routes will be here
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const favourite_routes_1 = __importDefault(require("./routes/favourite.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
app.use('/api/orders', order_routes_1.default);
app.use('/api/favourites', favourite_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/cart', cart_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
