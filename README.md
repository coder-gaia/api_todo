# 🧠 API Todo

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

---

## 🧩 Descrição

**API Todo** é o backend da aplicação de gerenciamento de tarefas que integra com o frontend da **Task Board App**.  
O projeto foi desenvolvido com **Node.js**, **Express** e **Prisma ORM**, utilizando **SQLite** como banco de dados.

Ele fornece autenticação JWT, papéis de usuário (`owner` e `admin`), e controle de acesso para criação e gerenciamento de _boards_ e _tasks_.

---

## ⚙️ Tecnologias

- **Node.js** + **Express**
- **TypeScript**
- **Prisma ORM**
- **SQLite**
- **JWT (Json Web Token)**
- **Jest** (para testes automatizados)

---

## 📂 Estrutura do Projeto

```
api_todo/
├── prisma/
│   ├── schema.prisma
│   ├── dev.db
│   └── test.db
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── app.ts
│   └── server.ts
├── tests/
│   └── *.test.ts
├── .env
├── .env.test
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Como Rodar o Projeto

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/seu-usuario/api_todo.git
cd api_todo
```

### 2️⃣ Instalar as dependências

```bash
npm install
```

### 3️⃣ Configurar o ambiente

Crie um arquivo `.env` na raiz com o conteúdo:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=supersecret123
```

E um `.env.test` para os testes:

```env
DATABASE_URL="file:./test.db"
JWT_SECRET="testsecret"
```

### 4️⃣ Rodando os Testes

```bash
npm run test
```

Os testes utilizam o banco `test.db`, garantindo isolamento entre ambiente de desenvolvimento e testes.

### 5️⃣ Executando o Servidor

```bash
npm run dev
```

A API estará disponível em:

```
http://localhost:3333
```

---

## 🧱 Integração com o Frontend

A interface (frontend) consome diretamente os endpoints dessa API, permitindo:

- Login e registro de usuários (owner e admin);
- Criação e gerenciamento de boards;
- Criação, edição e exclusão de tasks;
- Controle de acesso baseado em papéis;
- Persistência dos dados via Prisma + SQLite.

🔗 Não é necessário testar as rotas manualmente via Postman — toda a comunicação é feita pela interface frontend.

---

## 👥 Roles e Permissões

| Papel | Permissões principais                                      |
| ----- | ---------------------------------------------------------- |
| Owner | Criação de boards, tasks e atribuição de administradores.  |
| Admin | Gerenciamento de tasks e colaboração em boards atribuídos. |

---

## 💡 Scripts Úteis

| Comando                  | Descrição                                    |
| ------------------------ | -------------------------------------------- |
| `npm run dev`            | Inicia o servidor em modo de desenvolvimento |
| `npm run test:backend`   | Executa todos os testes automatizados        |
| `npx prisma studio`      | Abre o painel visual do Prisma               |
| `npx prisma migrate dev` | Aplica ou cria migrações no banco de dados   |

---

## 📜 Licença

Este projeto é de uso livre para fins de estudo e demonstração.

**Autor:** Alexandre Gaia  
**LinkedIn:** [linkedin.com/in/alexandre-gaia](https://www.linkedin.com/in/alexandre-gaia)  
**E-mail:** alexandregaia.dev@gmail.com
