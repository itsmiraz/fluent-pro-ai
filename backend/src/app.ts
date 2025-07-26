import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/not-found';
import router from './app/routes/routes';
import cookieParser from 'cookie-parser';

const app: Application = express();

//parser
app.use(express.json());
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://bike-management-client-three.vercel.app',
      'https://mosque-member-management-fr.vercel.app',
      'https://mosque-member-management-fr.vercel.app',
      '*'
    ],
    credentials: true,
  }),
);
app.use(cookieParser());
// Application Routes
app.use('/api', router);




app.get('/test', (req: Request, res: Response) => {
  res.send('Hello World!');
});
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use(globalErrorHandler);
// Not Found

app.use(notFound);

export default app;
