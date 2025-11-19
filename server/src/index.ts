import cors from 'cors';
import express , { Application, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import "dotenv/config";

const app: Application = express();

console.log("Environment:", process.env.PORT);
const port = process.env.PORT ;
import "dotenv/config";

// middlewares 

app.use(cors(
    {
        origin:process.env.CLIENT_URL,
        credentials:true
    }
)) ;
app.use(cookieParser())
app.use(express.static("public"))
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(helmet());

app.get('/', (_: Request, res: Response) => {
   
    res.status(200).json({ message: 'Server is running' });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});