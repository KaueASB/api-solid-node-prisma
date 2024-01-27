# Descrição do Projeto

Bem-vindo ao GymCheck API! Uma plataforma inspirada no modelo Gympass, criada para facilitar a gestão de academias e check-ins de usuários. Com esta API, você pode:

- Cadastrar usuários e academias.
- Realizar check-ins em academias próximas (até 100 metros).
- Validar check-ins e manter um histórico detalhado.
- Pesquisar academias pelo nome.
- Atribuir permissões administrativas para controle total 💪🏋️‍♂️

### Tecnologias e ferramentas utilizadas

- [TypeScript]()
- [Fastify](https://fastify.dev/docs/latest/Guides/Getting-Started/)
- [Docker Compose](https://docs.docker.com/compose)
- [PostegreSQL](https://www.postgresql.org/)
- [Prisma ORM](https://www.prisma.io/)
- [Vitest](https://vitest.dev/)
- [Supertest](https://github.com/ladjs/supertest)
- [Eslint](https://eslint.org/)

### Foi utilizado os seguintes Design Patterns

- Repository
- Factory  <!-- (https://refactoring.guru/design-patterns/factory-method) -->

### Para rodar o projeto

Antes de começar, certifique-se de ter o [Docker Compose](https://docs.docker.com/compose/install/) instalado.

1. Clone este repositório:

    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    cd api-solid
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Inicie os contêineres Docker (certifique-se de que o Docker esteja em execução):

    ```bash
    docker-compose up -d
    ```

4. Execute as migrações do banco de dados com o Prisma:

    ```bash
    npx prisma migrate dev
    ```

5. Inicie o servidor de desenvolvimento:

    ```bash
    npm run dev
    ```

A aplicação estará disponível em [http://localhost:3333](http://localhost:3333).

### Variáveis de Ambiente

Certifique-se de configurar as variáveis de ambiente necessárias em um arquivo `.env` na raiz do projeto.

- `PORT`: Porta em que o servidor será executado.
- `DATABASE_URL`: URL de conexão com o banco de dados PostgreSQL.

Agora você está pronto para explorar o projeto localmente. 😊

<details>
    <summary>
        <h2>RFs (Requisitos funcionais)</h2>
    </summary>

- [x] Deve ser possível se cadastrar
- [x] Deve ser possível se autenticar
- [x] Deve ser possível obter o perfil do usuário logado
- [x] Deve ser possível obter o número de check-ins realizados pelo usuário logado
- [x] Deve ser possível o usuário obter o histórico de check-ins
- [x] Deve ser possível o usuário buscar academias próximas (até 10km)
- [x] Deve ser possível o usuário buscar academias pelo nome
- [x] Deve ser possível o usuário realizar check-in em uma academia
- [x] Deve ser possível validar o check-in de um usuário
- [x] Deve ser possível cadastrar uma academia
</details>

<details>
    <summary>
        <h2>RNs (Regras de negócio)</h2>
    </summary>

- [x] O usuário não pode se cadastrar com um e-mail duplicado
- [x] O usuário não pode fazer 2 check-ins no mesmo dia
- [x] O usuário não pode validar o mesmo check-in duas vezes
- [x] O usuário não pode fazer check-in se não estiver há 100 mts da academia
- [x] O check-in só pode ser validado até 20 minutos após ser criado
- [x] O check-in só pode ser validado por administradores
- [x] A academia só pode ser cadastrada por administradores
</details>

<details>
    <summary>
        <h2>RNFs (Requisitos não funcionais)</h2>
    </summary>

- [x] A senha do usuário precisa estar criptografada
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL
- [x] Todas as listas de dados precisam estar paginadas com 20 itens por página
- [x] O Usuário deve ser identificado por um JWT (JSON Web Token)
</details>
