import { app, prisma } from "./app";
const port = 3000;
//const host = "179.124.149.2";
const host = "0.0.0.0";

const server = app.listen(port, host, () => {
  console.log(`Servidor rodando em http://${host}:${port}`);
});

// encerra corretamente ao receber sinais do SO
const shutdown = async () => {
  console.log('Encerrando servidor...');
  try {
    await prisma.$disconnect();
    server.close(() => {
      console.log('Servidor fechado e Prisma desconectado.');
      process.exit(0);
    });
  } catch (err) {
    console.error('Erro ao encerrar servidor:', err);
    process.exit(1);
  }
};

process.on('SIGINT', shutdown); 
process.on('SIGTERM', shutdown); 