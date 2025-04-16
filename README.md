# FezinhAI API

API para o projeto FezinhAI, uma aplicação de receitas inteligente.

## Tecnologias

- NestJS
- TypeScript
- AWS DynamoDB
- JWT Authentication
- RxJS
- Swagger

## Estrutura do Projeto

```
src/
├── infra/
│   ├── aws-dynamo-db/          # Módulo específico para AWS DynamoDB
│   │   ├── aws-dynamo-db.module.ts
│   │   └── aws-dynamo-db.service.ts
│   └── database/               # Módulo genérico de banco de dados
│       ├── database.module.ts
│       ├── database.service.ts
│       └── interfaces/
│           └── database.service.interface.ts
├── modules/
│   ├── auth/                   # Módulo de autenticação
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   └── dto/
│   │       ├── auth.dto.ts
│   │       └── auth-response.dto.ts
│   ├── health/                 # Módulo de health metrics
│   │   ├── health.controller.ts
│   │   ├── health.module.ts
│   │   ├── health.service.ts
│   │   └── dto/
│   │       └── health-metrics.dto.ts
│   └── users/                  # Módulo de usuários
│       ├── domain/
│       │   └── user.entity.ts
│       ├── dto/
│       │   ├── create-user.dto.ts
│       │   ├── update-user.dto.ts
│       │   └── update-user-preferences.dto.ts
│       ├── user.repository.ts
│       ├── user.service.ts
│       └── users.module.ts
└── shared/
    └── errors/                 # Tratamento de erros
        ├── http-errors.filter.ts
        └── database-erros.filter.ts
```

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Preencha as variáveis no arquivo `.env`:
```
# AWS Configuration
AWS_REGION=your-region
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
DYNAMODB_TABLE_NAME=your-table-name

# JWT Configuration
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=1d

# Application
PORT=3000
NODE_ENV=development
```

## Executando o Projeto

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## Documentação da API

A documentação da API está disponível em `/api` quando o servidor estiver rodando.

## Características

- Arquitetura limpa e modular
- Autenticação JWT
- Tratamento de erros centralizado
- Health check da aplicação
- Integração com AWS DynamoDB
- Programação reativa com RxJS
- Documentação Swagger
- Validação de DTOs
- Tipagem forte com TypeScript

## Padrões de Código

- SOLID principles
- Clean Architecture
- Repository Pattern
- Dependency Injection
- Reactive Programming
- Error Handling
- Type Safety

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
