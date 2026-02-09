import { Transaction } from './transaction.class';
import { TransactionType } from '../entities/transaction.entity';

export class Withdraw extends Transaction {
    constructor(
        walletId: string,
        amount: number,
        id?: string,
        date?: Date
    ) {
        super(walletId, amount, TransactionType.WITHDRAW, id, date);
    }

    validate(): void {
        if (this.amount <= 0) {
            throw new Error('Withdraw amount must be greater than zero');
        }
    }

    requiresCompliance(): boolean {
        // Compliance rules depends on transaction history
        // so it will be handled by TransactionProcessor
        return false;
    }

    getAdditionalData(): Record<string, any> {
    return {};
  }
}

