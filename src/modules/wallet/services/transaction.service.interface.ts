import { Transaction } from '../entities/transaction.entity';
import { TransactionDTO } from "../dtos/transaction.dto";

export interface ITransactionService {
    deposit(walletId: string, amount: number): Promise<TransactionDTO>;

    withdraw(walletId: string, amount: number): Promise<TransactionDTO>;

    transfer(
        fromWalletId: string,
        toWalletId: string,
        amount: number
    ): Promise<TransactionDTO>;

    getTransactionsByWalletId(walletId: string): Promise<TransactionDTO[]>;
}