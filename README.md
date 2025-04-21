# FezinhAI API

API para o projeto FezinhAI, uma aplicação de loterias inteligente.

## Tecnologias

- NestJS
- TypeScript
- AWS DynamoDB
- AWS SQS
- Redis (Cache)
- JWT Authentication
- RxJS
- Swagger
- Docker & Docker Compose

## Estrutura do Projeto

```
src/
├── infra/
│   ├── aws-dynamo-db/          # Módulo específico para AWS DynamoDB
│   │   ├── aws-dynamo-db.module.ts
│   │   └── aws-dynamo-db.service.ts
│   ├── aws-sqs/                # Módulo específico para AWS SQS
│   │   ├── aws-sqs.module.ts
│   │   └── aws-sqs.service.ts
│   ├── cache/                  # Módulo genérico de cache
│   │   ├── cache.module.ts
│   │   ├── cache.service.ts
│   │   └── interfaces/
│   │       └── cache.service.interface.ts
│   ├── database/               # Módulo genérico de banco de dados
│   │   ├── database.module.ts
│   │   ├── database.service.ts
│   │   └── interfaces/
│   │       └── database.service.interface.ts
│   ├── message-queue/          # Módulo genérico de filas
│   │   ├── message-queue.module.ts
│   │   ├── message-queue.service.ts
│   │   └── interfaces/
│   │       └── message-queue.service.interface.ts
│   └── redis/                  # Módulo específico para Redis
│       ├── redis.module.ts
│       └── redis.service.ts
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
│   ├── lotofacil/               # Módulo de Lotofacil
│   │   ├── domain/
│   │   │   └── lotofacil-results.entity.ts
│   │   ├── dto/
│   │   │   ├── save-results.dto.ts
│   │   │   └── save-stats-request.ts
│   │   ├── lotofacil.controller.ts
│   │   ├── lotofacil.repository.ts
│   │   ├── lotofacil.service.ts
│   │   └── lotofacil.module.ts
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
    ├── errors/                 # Tratamento de erros
    │   ├── http-errors.filter.ts
    │   └── database-erros.filter.ts
    └── guards/                 # Guards de autenticação
        └── jwt-auth.guard.ts
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
SQS_QUEUE_URL=https://sqs.your-region.amazonaws.com/your-account-id/your-queue-name

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# JWT Configuration
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=1d

# Application
PORT=3000
NODE_ENV=development
```

## Configuração do DynamoDB

Para o módulo Lotofacil, é necessário configurar uma tabela com a seguinte estrutura:

- **Nome da Tabela**: fezinhai_lotofacil_concursos
- **Chave de Partição (Hash Key)**: id (String)
- **Chave de Classificação (Sort Key)**: concurso (Number)
- **Índice Secundário Global (GSI)**:
  - **Nome**: concurso-index
  - **Chave de Partição**: concurso (Number)
  - **Projeção**: All

## Configuração do SQS

É necessário criar uma fila no AWS SQS:

1. Acesse o [AWS Console](https://console.aws.amazon.com/sqs/home)
2. Clique em "Criar fila"
3. Escolha o tipo de fila (Standard ou FIFO)
4. Configure as permissões necessárias
5. Adicione a URL da fila no arquivo `.env`

O módulo de fila de mensagens implementa uma interface `IMessageQueueService` que permite o envio de mensagens individuais ou em lote para a fila SQS, com suporte para parâmetros opcionais como delay e configurações FIFO.

## Configuração do Redis

O Redis é configurado automaticamente via Docker Compose. Para configuração manual, certifique-se de ter uma instância Redis disponível:

1. Instalar localmente:
```bash
# Ubuntu
sudo apt-get install redis-server

# MacOS
brew install redis
```

2. Ou usar um serviço gerenciado como Redis Cloud, Amazon ElastiCache, etc.

O sistema de cache utiliza o Redis para armazenar dados temporários, como estatísticas e análises da Lotofacil. A implementação segue um padrão de interface com métodos para definir, obter, verificar e excluir chaves do cache.

## Executando o Projeto

### Com Docker (recomendado)

```bash
# Iniciar a aplicação com Docker Compose
docker-compose up -d

# Verificar logs
docker-compose logs -f
```

### Sem Docker

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## Deployment

O deployment é automatizado via GitHub Actions para EC2:

1. Configure os secrets do repositório:
   - `EC2_INSTANCE`: Endereço IP ou DNS da instância EC2
   - `SSH_PRIVATE_KEY`: Chave SSH privada para acessar a instância

2. Execute o workflow "Deploy to EC2" manualmente na aba Actions do GitHub.

O processo de deployment utiliza Docker e Docker Compose para criar contêineres da aplicação e do Redis, garantindo um ambiente consistente e isolado.

## Documentação da API

A documentação da API está disponível em `/api` quando o servidor estiver rodando.

## Endpoints Principais

### Auth
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Login de usuário

### Health
- `GET /health` - Verificar saúde da aplicação

### Users
- `GET /users/me` - Obter dados do usuário autenticado
- `PATCH /users/me` - Atualizar dados do usuário autenticado

### Lotofacil
- `POST /lotofacil/save-results` - Salvar concursos da Lotofacil
- `GET /lotofacil/last` - Obter o concurso mais recente da Lotofacil
- `POST /lotofacil/analisys` - Salvar estatísticas da Lotofacil
- `GET /lotofacil/analisys` - Obter análises da Lotofacil

**Nota**: Todos os endpoints do Lotofacil requerem autenticação JWT.

## Características

- Arquitetura limpa e modular
- Autenticação JWT para todos os endpoints (exceto health e auth)
- Tratamento de erros centralizado
- Sistema de cache com Redis para armazenar estatísticas e análises
- Sistema de mensageria com AWS SQS para processamento assíncrono
- Health check da aplicação
- Integração com AWS DynamoDB para persistência de dados
- Programação reativa com RxJS e Observables
- Documentação Swagger com suporte a autenticação por token
- Validação de DTOs
- Tipagem forte com TypeScript
- Containerização com Docker e Docker Compose
- Deploy automatizado via GitHub Actions

## Padrões de Código

- SOLID principles
- Clean Architecture
- Repository Pattern
- Dependency Injection
- Reactive Programming com RxJS
- Error Handling centralizado
- Type Safety
- Interface-first design

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
