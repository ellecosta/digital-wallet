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

  /**
   * Specific validations for deposit transactions
   */
  validate(): void {
    const MAX_DEPOSIT = 1_000_000; // 1 million
    
    if (this.amount > MAX_DEPOSIT) {
      throw new Error(`Deposit cannot exceed ${MAX_DEPOSIT.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`);
    }
  }

  requiresCompliance(): boolean {
    return this.amount > 100_000;
  }

  getAdditionalData(): Record<string, any> {
    return {
      requiresCompliance: this.requiresCompliance(),
      complianceReason: this.amount > 100_000 
        ? 'Deposit above $100,000' 
        : null,
    };
  }
}