# Projeto - Sistema de Tickets

Este projeto é um sistema de gerenciamento de tickets/chamados.

## Requisitos

Antes de começar, instale:

- **Node.js** (versão 18+ recomendada)
- **Docker**
- **Docker Compose**
- **Git**

---

# 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd <nome-do-projeto>
```

---

# 2. Instalar dependências

```bash
npm install
```

ou

```bash
yarn install
```

---

# 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto.

Exemplo:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tickets"
PORT=3000
```

Caso esteja usando **Prisma**, a variável `DATABASE_URL` será utilizada para conectar no banco.

---

# 4. Subir o banco de dados com Docker

Execute:

```bash
docker compose up -d
```

ou, se estiver usando apenas docker:

```bash
docker run -d \
  --name postgres-tickets \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=tickets \
  postgres
```

Para verificar se o container está rodando:

```bash
docker ps
```

---

# 5. Rodar as migrations do banco

Se estiver usando **Prisma**:

```bash
npx prisma migrate dev
```

Ou apenas sincronizar o schema:

```bash
npx prisma db push
```

---

# 6. Iniciar o projeto

Modo desenvolvimento:

```bash
npm run dev
```

ou

```bash
yarn dev
```

Modo produção:

```bash
npm run build
npm start
```

---

# 7. Acessar a aplicação

Após iniciar o servidor, a aplicação estará disponível em:

```
http://localhost:3000
```

---

# Comandos úteis

### Ver containers rodando

```bash
docker ps
```

### Parar containers

```bash
docker compose down
```

### Resetar banco (apagar volumes)

```bash
docker compose down -v
```

---

# Estrutura básica do projeto

```
/src
  /controllers
  /services
  /routes
/prisma
  schema.prisma
.env
package.json
```

---

# Observações

- O banco de dados roda **localmente via Docker**.
- O backend se conecta usando `localhost:5432`.
- Caso queira acessar o banco via ferramenta externa (DBeaver, TablePlus, etc), utilize:

```
Host: localhost
Port: 5432
User: postgres
Password: postgres
Database: tickets
```
