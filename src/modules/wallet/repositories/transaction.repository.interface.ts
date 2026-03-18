import { Transaction } from '../entities/transaction.entity';
import { TransactionType } from '../entities/transaction.entity';

export interface ITransactionRepository {
    create(transaction: Transaction): Promise<Transaction>;
    findByWalletId(walletId: string): Promise<Transaction[]>;
    findByWalletIdAndPeriod(walletId: string, startDate: Date, endDate: Date): Promise<Transaction[]>;
    findRecentWithdraws(walletId: string, amount: number, startDate: Date): Promise<Transaction[]>;
}