export interface TransactionBody {
  amount: number;
}

export interface TransferBody {
  toWalletId: string;
  amount: number;
}