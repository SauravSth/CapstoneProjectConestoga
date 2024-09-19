import express from 'express';

import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const app = express();

app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
