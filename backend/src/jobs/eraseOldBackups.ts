import { exec } from 'child_process';
import cron from 'node-cron';
import path from 'path';

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

cron.schedule("0 10 * * *", () => {
  console.log("Limpando backups antigos...");

  try {

    const cleanCommand = `
      find ${BACKUP_DIR} -type f -mtime +7 -name "backup_*.sql" -delete; 
      find ${BACKUP_DIR} -type f -mtime +7 -name "backup_*.dump" -delete;`;
    runCommand(cleanCommand);

    console.log("Backups antigos removidos com sucesso.");
  } catch (err) {
    console.error("Erro ao remover backups antigos:", err);
  }
});
