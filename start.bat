@echo off

cd backend
start npm run dev
start docker-compose up -d
start npx prisma studio

cd ..
cd ticket-frontend 
start npm run dev