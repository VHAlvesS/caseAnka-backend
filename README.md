# 💼 Case Técnico – Backend com Node.js, Fastify, Prisma e MySQL

Este projeto é o backend do desafio técnico da Anka Tech, desenvolvido em Node.js utilizando Fastify, Prisma ORM e banco de dados MySQL. Toda a aplicação é conteinerizada com Docker para facilitar a execução e replicação.

---

## 🧱 Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Fastify](https://fastify.dev/)
- [Prisma ORM](https://www.prisma.io/)
- [MySQL](https://www.mysql.com/)
- [Docker + Docker Compose](https://docs.docker.com/compose/)
- [Zod](https://zod.dev/) – Validação de schemas
- [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Como rodar o projeto

### Pré-requisitos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Passo a passo

1. Clone o repositório:

```bash
git clone https://github.com/VHAlvesS/caseAnka-backend.git
cd caseAnka-backend
```

2. Suba os containers com Docker Compose:

```bash
docker-compose up -d --build
```

Isso irá:

- Construir a imagem do backend
- Subir o banco MySQL
- Executar as migrations (Prisma)
- Rodar o seed com os ativos fixos
- Iniciar o servidor Fastify na porta 3000

---

## 🌐 Endpoints disponíveis

| Recurso   | Método | Endpoint                            | Descrição                       |
| --------- | ------ | ----------------------------------- | ------------------------------- |
| Clients   | GET    | `/clients`                          | Lista todos os clientes         |
| Clients   | POST   | `/clients`                          | Cria um novo cliente            |
| Clients   | PUT    | `/clients/:id`                      | Atualiza um cliente             |
| Clients   | DELETE | `/clients/:id`                      | Remove um cliente               |
| Ativos    | GET    | `/assets`                           | Lista os ativos disponíveis     |
| Alocações | GET    | `/clients/:id/allocations`          | Lista alocações de um cliente   |
| Alocações | POST   | `/clients/:id/allocations`          | Cria nova alocação para cliente |
| Alocações | PUT    | `/clients/:id/allocations/:assetId` | Atualiza a quantidade alocada   |
| Alocações | DELETE | `/clients/:id/allocations/:assetId` | Remove a alocação               |

Paginação está disponível via query params: ?page=1&perPage=10

---

## 🔐 Banco de Dados

A conexão com o banco MySQL é feita via Docker, com as seguintes credenciais:

- Host interno: db
- Porta interna: 3306
- Porta externa (localhost): 3307
- Usuário: ankadev
- Senha: devpass
- Banco: ankatech

---

## ✅ Comportamento do Docker

O backend aguarda 20 segundos antes de executar as migrations/seeds (definido no Dockerfile). Isso evita falhas de conexão enquanto o MySQL ainda está subindo.

---

## 📁 Estrutura do Projeto

```
backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seeds.ts
├── src/
│   ├── routes/
│   ├── lib/
│   ├── app.ts
│   └── server.ts
├── Dockerfile
├── docker-compose.yml
├── .env
├── package.json
└── tsconfig.json
```

---

## 🧹 Comandos úteis

```bash
# Derruba os containers e remove os volumes
docker-compose down -v

# Sobe do zero com rebuild
docker-compose up -d --build

# Acompanha os logs do backend
docker-compose logs -f backend
```

---

## 🧠 Observações

- A lista de ativos é fixa (seed inicial)
- O campo email de cliente é único
- Cada cliente pode ter no máximo 1 alocação por ativo
- Todas as rotas têm validação com Zod
