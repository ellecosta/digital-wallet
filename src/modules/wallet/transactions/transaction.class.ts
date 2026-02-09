import { v4 as uuidv4 } from 'uuid';
import { TransactionType } from '../entities/transaction.entity';

export abstract class Transaction {
  public readonly id: string;
  public readonly walletId: string;
  public readonly amount: number;
  public readonly date: Date;
  public readonly type: TransactionType;

  constructor(
    walletId: string,
    amount: number,
    type: TransactionType,
    id?: string,
    date?: Date
  ) {
    this.id = id || uuidv4();
    this.walletId = walletId;
    this.amount = amount;
    this.type = type;
    this.date = date || new Date();

    this.validateBase(); 
  }

  private validateBase(): void {
    // Simple validations 
    if (!this.walletId || this.walletId.trim() === '') {
      throw new Error('Wallet ID is required');
    }

    if (this.amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    if (isNaN(this.amount)) {
      throw new Error('Invalid amount');
    }

  }

  abstract validate(): void;
  abstract requiresCompliance(): boolean;
  abstract getAdditionalData(): Record<string, any>;

  public toObject(): {
    id: string;
    walletId: string;
    amount: number;
    type: TransactionType;
    date: Date;
  } {
    return {
      id: this.id,
      walletId: this.walletId,
      amount: this.amount,
      type: this.type,
      date: this.date,
    };
  }
}