import "reflect-metadata";
import { DataSource } from "typeorm";
import { Wallet } from "../../entities/wallet.entity";
import { Transaction } from "../../entities/transaction.entity";
import { ComplianceTransaction } from "../../entities/compliance.transaction.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "wallet",
  synchronize: true, // só para desenvolvimento
  logging: false,
  entities: [
    Wallet,
    Transaction,
    ComplianceTransaction,
  ],
});
