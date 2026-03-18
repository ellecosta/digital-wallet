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
    if (this.walletId === this.destinationWalletId) {
      throw new Error(
        'Source and destination wallets must be different'
      );
    }

    const MIN_TRANSFER = 5;
    if (this.amount < MIN_TRANSFER) {
      throw new Error(`Minimum transfer amount is ${MIN_TRANSFER}`);
    }
  }

  async execute({
    sourceWallet,
    loadWalletById,
    saveWallet,
  }: any) {
    if (Number(sourceWallet.balance) < this.amount) {
      throw new Error('Insufficient balance');
    }

    const destinationWallet = await loadWalletById(
      this.destinationWalletId
    );

    if (!destinationWallet) {
      throw new Error('Destination wallet not found');
    }

    sourceWallet.balance = Number(sourceWallet.balance) - this.amount;
    destinationWallet.balance = Number(destinationWallet.balance) + this.amount;

    await saveWallet(sourceWallet);
    await saveWallet(destinationWallet);

    return { targetWalletId: this.destinationWalletId };
  }

  shouldCheckCompliance(): boolean {
    return this.amount > 5_000;
  }

  getAdditionalData(): Record<string, any> {
    return {
      complianceReason:
        this.amount > 5_000 ? 'Transfer above $5,000' : null,
    };
  }

  public toObject() {
    return {
      ...super.toObject(),
      destinationWalletId: this.destinationWalletId,
    };
  }
}