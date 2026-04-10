import cron from 'node-cron';
import path from 'path';
import fs from 'fs';

const BACKUP_DIR = path.resolve(__dirname, "../../backups");

// Garante que a pasta existe
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function deleteOldBackups(days: number) {
  const now = Date.now();
  const maxAge = days * 24 * 60 * 60 * 1000;

  try {
    const files = fs.readdirSync(BACKUP_DIR);

    files.forEach((file) => {
      // Filtra apenas .sql e .dump com prefixo backup_
      if (
        !file.startsWith("backup_") ||
        (!file.endsWith(".sql") && !file.endsWith(".dump"))
      ) {
        return;
      }

      const filePath = path.join(BACKUP_DIR, file);
      const stats = fs.statSync(filePath);

      const fileAge = now - stats.mtime.getTime();

      if (fileAge > maxAge) {
        fs.unlinkSync(filePath);
        console.log(`Removido: ${file}`);
      }
    });

    console.log("Limpeza concluída.");
  } catch (err) {
    console.error("Erro ao limpar backups:", err);
  }
}

// Roda todo dia às 10:00
cron.schedule("0 10 * * *", () => {
  console.log("Limpando backups antigos...");
  deleteOldBackups(7);
});