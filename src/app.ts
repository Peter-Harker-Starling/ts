import express from 'express';
import authRouter from './routes/auth.js';
import creditTransferRouter from './routes/creditTransfer.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.get('/', (req, res) => {
    res.json({ message: 'Hello World !' });
});

app.use('/auth', authRouter);
app.use('/credit-transfer', creditTransferRouter);

export default app;