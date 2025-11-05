import express, { urlencoded } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
import profileRouter from './routes/profile.routes.js';


dotenv.config();

const app = express()
const port = Number(process.env.PORT) || 4000;
app.use(express.json());
app.use(urlencoded({extended:true}));
app.use(cookieParser())
app.use(cors({
    origin: [process.env.BASE_URL, 'http://localhost:4000' ],
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders : ['Content-Type', 'Authorization'],
    credentials : true
}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

connectDB();

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/profile', profileRouter);




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
