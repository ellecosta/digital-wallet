import { TransactionType } from "../entities/transaction.entity";

export interface TransactionDTO {
  id: string;
  walletId: string;
  amount: number;
  type: TransactionType;
  date: Date;
}
