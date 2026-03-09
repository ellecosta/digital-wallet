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
    const MAX_WITHDRAW = 10_000;

    if (this.amount > MAX_WITHDRAW) {
      throw new Error(`Maximum withdraw amount is ${MAX_WITHDRAW}`);
    }
  }

  async execute({ sourceWallet, saveWallet }: any) {
    if (sourceWallet.balance < this.amount) {
      throw new Error('Insufficient balance');
    }

    sourceWallet.balance -= this.amount;
    await saveWallet(sourceWallet);

    return { targetWalletId: null };
  }

  requiresCompliance(): boolean {
    return false; // still handled externally by history rule
  }

  getComplianceOperationType(): string {
    return 'MULTIPLE_WITHDRAWALS';
  }

  getAdditionalData(): Record<string, any> {
    return {};
  }
}