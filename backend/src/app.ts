import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

//jobs
import './jobs/backupJob'
import './jobs/eraseOldBackups'

//Localização das rotas da aplicação
import usersRoutes from './routes/users-routes';
import casesRoutes from './routes/cases-routes';
import { PrismaClient } from '@prisma/client';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
});

dotenv.config();

export const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));


app.use(cors({
  origin: '*', //Descomente apenas em desenvolvimento, isso permite acesso irrestrito de qualquer fonte
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true 
}));

app.use(express.static(path.join(__dirname, '../public')));

//declaração das rotas
app.use('/', usersRoutes);
app.use('/', casesRoutes);



app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = typeof error.code === 'number' ? error.code : 500;
  const message = typeof error.message === 'string' ? error.message : 'An unknown error occurred!';

  res.status(statusCode).json({ message });
});