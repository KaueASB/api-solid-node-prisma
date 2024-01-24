# App

App Style Gympass.

## Tecnologias e ferramentas utilizadas

- TypeScript
- Fastify
- Vitest
- Docker Compose
- Prisma ORM
- PostegreSQL
- Eslint

## Foi utilizado os seguintes Design Patterns

- Repository
- Factory

## Para rodar o projeto

> Atenção: É necessário ter o docker compose instalado

```js
cd api-solid
npm install
docker-compose up -d
npx prisma migrate dev
npm run dev
```

## RFs (Requisitos funcionais)

- [x] Deve ser possível se cadastrar
- [x] Deve ser possível se autenticar
- [x] Deve ser possível obter o perfil do usuário logado
- [x] Deve ser possível obter o número de check-ins realizados pelo usuário logado
- [x] Deve ser possível o usuário obter o histórico de check-ins
- [x] Deve ser possível o usuário buscar academias próximas (até 10km)
- [x] Deve ser possível o usuário buscar academias pelo nome
- [x] Deve ser possível o usuário realizar check-in em uma academia
- [ ] Deve ser possível validar o check-in de um usuário
- [x] Deve ser possível cadastrar uma academia

## RNs (Regras de negócio)

- [x] O usuário não pode se cadastrar com um e-mail duplicado
- [x] O usuário não pode fazer 2 check-ins no mesmo dia
- [x] O usuário não pode fazer check-in se não estiver há 100 mts da academia
- [ ] O check-in só pode ser validado até 20 minutos após ser criado
- [ ] O check-in só pode ser validado por administradores
- [ ] A academia só pode ser cadastrada por administradores

## RNFs (Requisitos não funcionais)

- [x] A senha do usuário precisa estar criptografada
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL
- [x] Todas as listas de dados precisam estar paginadas com 20 itens por página
- [ ] O Usuário deve ser identificado por um JWT (JSON Web Token)
