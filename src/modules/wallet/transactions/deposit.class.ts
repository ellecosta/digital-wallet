import { Transaction } from './transaction.class';
import { TransactionType } from '../entities/transaction.entity';

export class Deposit extends Transaction {
  constructor(
    walletId: string,
    amount: number,
    id?: string,
    date?: Date
  ) {
    super(walletId, amount, TransactionType.DEPOSIT, id, date);
  }

  validate(): void {
    const MAX_DEPOSIT = 1_000_000;

    if (this.amount > MAX_DEPOSIT) {
      throw new Error(
        `Deposit cannot exceed ${MAX_DEPOSIT.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })}`
      );
    }
  }

  async execute({ sourceWallet, saveWallet }: any) {
    sourceWallet.balance = Number(sourceWallet.balance) + this.amount;
    await saveWallet(sourceWallet);
    return { targetWalletId: null };
  }

  shouldCheckCompliance(): boolean {
    return this.amount > 100_000;
  }

  getAdditionalData(): Record<string, any> {
    return {
      complianceReason:
        this.amount > 100_000 ? 'Deposit above $100,000' : null,
    };
  }
}