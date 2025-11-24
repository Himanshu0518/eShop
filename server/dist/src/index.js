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
const port = process.env.PORT;
// middlewares 
// FIRST: Body parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// SECOND: Cookie
app.use((0, cookie_parser_1.default)());
// THIRD: CORS
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
// FOURTH: Other middlewares
app.use(express_1.default.static("public"));
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)());
app.get('/', (_, res) => {
    res.status(200).json({ message: 'Server is running' });
});
// all routes will be here
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const favourite_routes_1 = __importDefault(require("./routes/favourite.routes"));
app.use('/api/favourites', favourite_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/cart', cart_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
