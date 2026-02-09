import { Transaction } from './transaction.class';    
import { TransactionType } from '../entities/transaction.entity';

export class Transfer extends Transaction { 
    public readonly destinationWalletId: string;
    constructor(
        sourceWalletId: string,
        destinationWalletId: string,
        amount: number,
        id?: string,
        date?: Date
    ) {
        super(sourceWalletId, amount, TransactionType.TRANSFER, id, date);
        this.destinationWalletId = destinationWalletId;
    }

    validate(): void {
        // Transfer-specific validation: source and destination wallets must differ
        if (this.walletId === this.destinationWalletId) {
            throw new Error('Source and destination wallets must be different');
        }

        const MIN_TRANSFER = 1; 
        if (this.amount < MIN_TRANSFER) {
            throw new Error(`Minimum transfer amount is ${MIN_TRANSFER}`);
        }
    }

    requiresCompliance(): boolean {
        return this.amount > 5_000;
    }

    getAdditionalData(): Record<string, any> {
    return {
      requiresCompliance: this.requiresCompliance(),
      complianceReason: this.amount > 5_000 
        ? 'Transfer above $5,000' 
        : null,
    };
  }

  public toObject() {
    return {
      ...super.toObject(),
      destinationWalletId: this.destinationWalletId,
        };
    }
}

