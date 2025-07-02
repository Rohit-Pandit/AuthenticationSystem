import express, { urlencoded } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
dotenv.config();
const app = express()
const port = Number(process.env.PORT) || 4000;
app.use(express.json());
app.use(urlencoded({extended:true}));
app.use(cors({
    origin: [process.env.BASE_URL, 'http://localhost:4000' ],
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders : ['Content-Type', 'Authorization']
}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

connectDB();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
