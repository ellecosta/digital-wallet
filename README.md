# Digital Wallet

![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-0.3-FE0803?logo=typeorm&logoColor=white)
![Jest](https://img.shields.io/badge/Tested_with-Jest-C21325?logo=jest&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![Architecture](https://img.shields.io/badge/Architecture-SOLID-4B32C3)

## O que é o projeto

É uma API de carteira digital (carteira financeira) que gerencia carteiras de usuários e processa transações financeiras com monitoramento de compliance.

**Stack:**
Express 5, TypeScript (strict), TypeORM + PostgreSQL 15, Zod (validação), bcrypt (hash de senha), Jest + Supertest (testes), Docker/Docker Compose.

---

## O que ele faz

* **Carteiras:** cria carteira com validação de CPF (algoritmo de dígito verificador), senha com hash bcrypt e saldo inicial zero.
* **Transações:** depósito, saque e transferência, com transações atômicas no banco (QueryRunner + `pessimistic_write` lock para evitar condições de corrida).
* **Compliance:** sinaliza automaticamente transferências/depósitos grandes (acima de $100K) e múltiplos saques rápidos (3+ em 5 minutos).
* **Extrato:** gera o *statement* de transações por período.

---

## Decisões de Arquitetura

Uma das principais preocupações no desenvolvimento foi a aplicação dos princípios **SOLID**, especialmente:

* Single Responsibility Principle (SRP)
* Liskov Substitution Principle (LSP)
* Dependency Inversion Principle (DIP)

---

### Single Responsibility Principle

O projeto é separado em camadas bem definidas, cada uma com responsabilidade isolada:

* **Controller:** cuida apenas de HTTP. Não conhece banco nem regra de negócio.
* **Service:** orquestra os casos de uso. Não conhece HTTP nem SQL.
* **Repository:** responsável por persistência/consultas com TypeORM. É o único que conhece o `AppDataSource` e queries.
* **Entities:** representam apenas o modelo de dados.

---

### Dependency Inversion Principle

Módulos de alto nível não dependem de implementações concretas, mas de abstrações:

* `ITransactionRepository` → `TypeOrmTransactionRepository`
* `IWalletRepository` → `TypeOrmWalletRepository`
* `IComplianceTransactionRepository` → `TypeOrmComplianceTransactionRepository`
* `ITransactionService` → `TransactionService`

**Na prática:**

```ts
// transaction.service.ts
constructor(
  private transactionRepository: ITransactionRepository, // abstração
  private transactionProcessor: TransactionProcessor,
) {}
```

O `TransactionService` depende de interfaces, não de implementações concretas.
A definição das dependências acontece na camada de composição (`transaction.routes.ts`), onde tudo é instanciado e injetado.

---

### Liskov Substitution Principle

Aplicado principalmente na classe `TransactionProcessor`.

O método `process()` trabalha sobre a abstração `Transaction`, tratando:

* Deposit
* Withdraw
* Transfer

de forma uniforme e intercambiável, sem depender do tipo concreto.

Isso é possível graças ao contrato definido na classe abstrata (`transaction.class.ts`), que obriga todos os subtipos a implementarem:

* `execute`
* `validate`
* `shouldCheckCompliance`

---

## O que eu aprendi

* Aplicação prática dos princípios **SOLID**
* Arquitetura em camadas
* Conceitos de:

  * Atomicidade
  * Race conditions
* Implementação de:

  * Testes unitários
  * Testes de integração
* Uso avançado de TypeScript em um projeto real

---

## O que pode melhorar

* **Uso de `synchronize: true`:**
  Em produção é perigoso, pois pode alterar ou dropar o schema. O ideal é usar **migrations do TypeORM**.

* **Tratamento de erros:**
  Atualmente os controllers retornam sempre `400`. O ideal é:

  * Criar classes de erro de domínio
  * Implementar um middleware global de erro no Express
  * Retornar status codes apropriados

* **Tipo do balance:**
  O `decimal` do PostgreSQL retorna como string no TypeORM. Para valores monetários:

  * Usar um **Value Object de Money**, ou
  * Trabalhar com inteiros (ex: centavos)

---

## Como rodar o projeto

```bash
# subir containers
docker-compose up

# rodar aplicação em modo dev
npm run dev

# rodar testes
npm test
```

---

## Observação

Este projeto foi desenvolvido com foco em boas práticas de engenharia de software, priorizando organização, escalabilidade e clareza arquitetural.
