import { Transaction } from '../entities/transaction.entity';
import { ITransactionRepository } from '../repositories/transaction.repository.interface';
import { ITransactionService } from './transaction.service.interface';
import { TransactionProcessor } from '../transactions/transaction.processor.class'; 

import { Deposit } from '../transactions/deposit.class';
import { Withdraw } from '../transactions/withdraw.class';
import { Transfer } from '../transactions/transfer.class';

import { TransactionDTO } from "../dtos/transaction.dto";

export class TransactionService implements ITransactionService {
    constructor(
        private transactionRepository: ITransactionRepository,
        private transactionProcessor: TransactionProcessor
    ) {}


    async deposit(walletId: string, amount: number): Promise<TransactionDTO> {
        const transaction = new Deposit(walletId, amount);

        await this.transactionProcessor.process(transaction);

        return transaction.toObject()
    }

    async withdraw(walletId: string, amount: number): Promise<TransactionDTO> {
        const transaction = new Withdraw(walletId, amount);

        await this.transactionProcessor.process(transaction);
        
        return transaction.toObject();
    }

    async transfer(
        fromWalletId: string,
        toWalletId: string,
        amount: number
    ): Promise<TransactionDTO> {
        const transaction = new Transfer(fromWalletId, toWalletId, amount);   
        
        await this.transactionProcessor.process(transaction);

        return transaction.toObject();
    }

    async getTransactionsByWalletId(walletId: string): Promise<TransactionDTO[]> {
        const transactions = await this.transactionRepository.findByWalletId(walletId);
        return transactions.map((t) => this.toDTO(t));
    }

    private toDTO(t: Transaction): TransactionDTO {
    return {
        id: t.id,
        walletId: t.fromWallet.id,
        amount: t.amount,
        type: t.type,
        date: t.createdAt,
    };
}

}
