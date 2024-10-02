import express from 'express';
import router from './routes/index.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = express();

app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;

app.use('/api', router);

app.get('*', (req, res) => {
	res.send('404 Page');
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
