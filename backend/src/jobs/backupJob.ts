import cron from "node-cron";
import { exec } from "child_process";
import path from "path";
import fs from "fs";  

const CONTAINER_ID = "ticket_database"; 
const DB_USER = "postgres"; 
const DB_NAME = "mydb"; 
const BACKUP_DIR = path.resolve(__dirname, "../../backups");

const runCommand = (command: string) => {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao executar o backup: ${error.message}`);
      return;
    }
    if (stderr) {
      console.warn(`Aviso: ${stderr}`);
    }
    console.log(`Backup concluído: ${stdout}`);
  });
};

if (!fs.existsSync(BACKUP_DIR)) {
  throw new Error(`Erro: O diretório de backup não existe - ${BACKUP_DIR}`);
}


cron.schedule("0 9 * * *", () => {
  console.log("Iniciando backup do banco de dados...");

  try {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    //const year = date.getFullYear();

    const dateTag = `${day}_${month}`;

    const sqlBackup = path.join(BACKUP_DIR, `backup_${dateTag}.sql`);
    const dumpBackup = path.join(BACKUP_DIR, `backup_${dateTag}.dump`);

    const sqlCommand = `docker exec -t ${CONTAINER_ID} pg_dump -U ${DB_USER} -d ${DB_NAME} > ${sqlBackup}`;
    const dumpCommand = `docker exec -t ${CONTAINER_ID} pg_dump -U ${DB_USER} -d ${DB_NAME} > ${dumpBackup}`;

    runCommand(sqlCommand);
    runCommand(dumpCommand);
  } catch (err) {
    console.error("Erro na realização do backup:", err);
  }
});
