# SQA Social Media

Projeto educacional com uma API Spring Boot e um frontend Next.js.

## Visão Geral

- `api/`: backend Java 17 com Spring Boot, autenticação, usuários, posts e curtidas.
- `client/`: frontend Next.js/React que consome a API.

Principais rotas da aplicação:

- Frontend: `http://localhost:3000`
- API: `http://localhost:8080`

## Como Rodar

Pré-requisitos:

- Java 17+
- Node.js 18+
- npm
- MySQL configurado para o ambiente de desenvolvimento

API:

```bash
cd api
./mvnw spring-boot:run
```

Frontend:

```bash
cd client
npm install
npm run dev
```

O frontend usa `NEXT_PUBLIC_BASE_URL` para definir a URL da API. Exemplo de `.env` em `client/`:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:8080
```

## Testes

Testes de caixa-branca (unidade/integração):

```bash
# API (JUnit + H2 em memória)
cd api && ./mvnw test

# Frontend (Jest + Testing Library)
cd client && npm test
```

Testes de caixa-preta (E2E e API com Playwright), com a API em `http://localhost:8080` e o frontend em `http://localhost:3000` rodando:

```bash
cd e2e
npm install
npx playwright install
npm test
```

## Integração Contínua (GitHub Actions)

O workflow `.github/workflows/ci.yml` é disparado sempre que um Pull Request é aberto, atualizado ou reaberto com destino à `main`. Ele possui três jobs:

- `api-tests`: configura Java 17, instala dependências e roda os testes da API;
- `client-tests`: configura Node.js 20, instala dependências e roda os testes do frontend;
- `e2e-tests`: sobe MySQL (service container), a API e o frontend no runner e executa toda a suíte Playwright (E2E + API).

## Documentações

- [README da API](api/README.md)
- [README do Frontend](client/README.md)
- [README dos Testes (Playwright)](e2e/README.md)
- [DummyJSON API Docs](https://dummyjson.com/docs)
