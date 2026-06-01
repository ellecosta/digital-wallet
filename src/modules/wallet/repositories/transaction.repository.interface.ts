import { Transaction } from "../entities/transaction.entity";
import { TransactionType } from "../entities/transaction.entity";
import { EntityManager } from "typeorm";

export interface ITransactionRepository {
  create(
    transaction: Transaction,
    manager?: EntityManager,
  ): Promise<Transaction>;
  findByWalletId(walletId: string): Promise<Transaction[]>;
  findByWalletIdAndPeriod(
    walletId: string,
    startDate: Date,
  ): Promise<Transaction[]>;
  findRecentWithdraws(
    walletId: string,
    amount: number,
    startDate: Date,
    manager?: EntityManager,
  ): Promise<Transaction[]>;
}
