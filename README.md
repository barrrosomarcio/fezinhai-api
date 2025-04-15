# FezinhAI API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

FezinhAI API is a NestJS-based backend service that provides user management and authentication functionality. The API is built with TypeScript and uses DynamoDB as its database.

## Features

- User authentication (JWT-based)
- User management (CRUD operations)
- User preferences management
- Reactive programming with RxJS
- Swagger API documentation
- Error handling with custom error classes
- Type-safe DTOs and entities

## Project Structure

```
src/
├── modules/
│   ├── auth/           # Authentication module
│   └── users/          # User management module
├── shared/
│   ├── errors/         # Custom error classes
│   └── guards/         # Authentication guards
└── infra/
    └── database/       # Database service
```

## Project Setup

```bash
# Install dependencies
$ npm install

# Development
$ npm run start:dev

# Production
$ npm run start:prod
```

## Environment Variables

Create a `.env` file with the following variables:

```env
JWT_SECRET=your_jwt_secret
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
```

## Testing

```bash
# Unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

## API Documentation

The API documentation is available through Swagger UI at `/api` when the application is running. It provides detailed information about all available endpoints, request/response schemas, and authentication requirements.

## License

This project is licensed under the MIT License.
