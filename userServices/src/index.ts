import express from 'express';
import "dotenv/config";
import { connectDB } from './lib/db.confit.js';
import userRouter from './route.js';

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use('api/v1', userRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectDB();
});
