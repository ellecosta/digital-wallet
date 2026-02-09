import { Transaction } from "./transaction.class";
import { Deposit } from "./deposit.class";
import { Transfer } from "./transfer.class";

import { ITransactionRepository } from "../repositories/transaction.repository.interface";
import { IComplianceTransactionRepository } from "../repositories/compliance.transaction.repository.interface";
import { IWalletRepository } from "../repositories/wallet.repository.interface";

import { ComplianceTransaction } from "../entities/compliance.transaction.entity";
import { Withdraw } from "./withdraw.class";

export class TransactionProcessor {
    constructor(
    private transactionRepository: ITransactionRepository,
    private complianceTransactionRepository: IComplianceTransactionRepository,
    private walletRepository: IWalletRepository
  ) {}

  async process(transaction: Transaction): Promise<void> {
    // 1. Validate transaction
    transaction.validate();

    // 2. Load wallet
    const wallet = await this.walletRepository.findById(
      transaction.walletId
    );

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    // 3. Handle transaction types
    if (transaction instanceof Deposit) {
      wallet.balance += transaction.amount;
      await this.walletRepository.save(wallet);
    }

    if (transaction instanceof Withdraw) {
      if (wallet.balance < transaction.amount) {
        throw new Error("Insufficient balance");
      }

      wallet.balance -= transaction.amount;
      await this.walletRepository.save(wallet);

      // Compliance: multiple withdraws
      const shouldRegister =
        await this.checkWithdrawCompliance(transaction);

      if (shouldRegister) {
        await this.registerCompliance(transaction, null);
      }
    }

    if (transaction instanceof Transfer) {
      if (wallet.balance < transaction.amount) {
        throw new Error("Insufficient balance");
      }

      const destinationWallet =
        await this.walletRepository.findById(
          transaction.destinationWalletId
        );

      if (!destinationWallet) {
        throw new Error("Destination wallet not found");
      }

      wallet.balance -= transaction.amount;
      destinationWallet.balance += transaction.amount;

      await this.walletRepository.save(wallet);
      await this.walletRepository.save(destinationWallet);
    }

    // 4. Save transaction
    await this.transactionRepository.create(
      transaction.toObject() as any
    );

    // 5. Standard compliance rules
    if (transaction.requiresCompliance()) {
      if (transaction instanceof Transfer) {
        await this.registerCompliance(
          transaction,
          transaction.destinationWalletId
        );
      } else {
        await this.registerCompliance(transaction, null);
      }
    }
  }

  private async checkWithdrawCompliance(
    transaction: Withdraw
  ): Promise<boolean> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const allTransactions =
      await this.transactionRepository.findByWalletId(
        transaction.walletId
      );

    const similarWithdraws = allTransactions.filter((t) => {
      return (
        t.type === transaction.type &&
        t.amount === transaction.amount &&
        new Date(t.createdAt) >= fiveMinutesAgo
      );
    });

    // If there are already 2, this becomes the 3rd
    return similarWithdraws.length >= 2;
  }

  private async registerCompliance(
    transaction: Transaction,
    toWalletId: string | null
  ): Promise<void> {
    const compliance = new ComplianceTransaction();

    compliance.amount = transaction.amount;

    if (transaction instanceof Deposit) {
      compliance.operationType = "LARGE_DEPOSIT" as any;
    } else if (transaction instanceof Transfer) {
      compliance.operationType = "LARGE_TRANSFER" as any;
    } else {
      compliance.operationType = "MULTIPLE_WITHDRAWALS" as any;
    }

    compliance.sourceWallet = {
      id: transaction.walletId,
    } as any;

    if (toWalletId) {
      compliance.targetWallet = {
        id: toWalletId,
      } as any;
    }

    await this.complianceTransactionRepository.create(
      compliance
    );
  }
}