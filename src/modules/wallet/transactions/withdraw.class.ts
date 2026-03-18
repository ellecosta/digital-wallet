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
    if (Number(sourceWallet.balance) < this.amount) {
      throw new Error('Insufficient balance');
    }

    sourceWallet.balance = Number(sourceWallet.balance) - this.amount;
    await saveWallet(sourceWallet);

    return { targetWalletId: null };
  }

  shouldCheckCompliance(): boolean {
    return true; // must check records
  }

  getAdditionalData(): Record<string, any> {
    return {};
  }
}