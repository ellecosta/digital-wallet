// src/tests/fakes/fake-transaction-processor-class.ts
import { Transaction } from "../../modules/wallet/transactions/transaction.class";

export class FakeTransactionProcessor {
  public processedTransactions: Transaction[] = [];

  async process(transaction: Transaction): Promise<void> {
    this.processedTransactions.push(transaction);
  }
}
