import express from 'express';
import router from './routes/index.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config({ path: '../.env' });

const app = express();

const PORT = process.env.PORT;
const DB_URL = process.env.MONGO_URL;

mongoose
	.connect(DB_URL)
	.then(console.log('Connected to Database'))
	.catch((e) => console.log(e));

// Express Middlewares
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use('/api', router);

app.get('*', (req, res) => {
	res.send('404 Page');
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
