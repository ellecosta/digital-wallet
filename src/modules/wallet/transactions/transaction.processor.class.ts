import { Transaction } from "./transaction.class";
import { TransactionType } from '../entities/transaction.entity';
import { ITransactionRepository } from "../repositories/transaction.repository.interface";
import { IComplianceTransactionRepository } from "../repositories/compliance.transaction.repository.interface";
import { IWalletRepository } from "../repositories/wallet.repository.interface";
import { ComplianceTransaction } from "../entities/compliance.transaction.entity";
import { AppDataSource } from "../database/data.source";
import { DataSource, EntityManager } from "typeorm";

export class TransactionProcessor {
  constructor(
    private transactionRepository: ITransactionRepository,
    private complianceTransactionRepository: IComplianceTransactionRepository,
    private walletRepository: IWalletRepository,
    private dataSource: DataSource = AppDataSource
  ) {}

  async process(transaction: Transaction): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;

      // 1. Validate (polymorphic)
      transaction.validate();

      // 2. Load wallet (with lock)
      const wallet = await this.walletRepository.findById(
        transaction.walletId, manager
      );
      if (!wallet) {
        throw new Error("Wallet not found");
      }

      // 3. Execute transaction (LSP CORE)
      const { targetWalletId } = await transaction.execute({
        sourceWallet: wallet,
        loadWalletById: (id: string) => this.walletRepository.findById(id, manager),
        saveWallet: (wallet: any) => this.walletRepository.save(wallet, manager),
      });

      // 4. Save transaction (no instanceof)
      await this.transactionRepository.create({
        id: transaction.id,
        amount: transaction.amount,
        type: transaction.type,
        fromWallet: { id: transaction.walletId } as any,
        toWallet: targetWalletId
          ? { id: targetWalletId }
          : null,
      } as any, manager);

      // 5. Compliance 
      await this.handleCompliance(transaction, targetWalletId, manager);  

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async handleCompliance(transaction: Transaction, toWalletId: string | null, manager: EntityManager): Promise<void> {
    if (!transaction.shouldCheckCompliance())
      return;

    // TRANSFER
    if (transaction.type === TransactionType.TRANSFER) {
      await this.registerCompliance(transaction, toWalletId, "LARGE_TRANSFER", manager);
      return;
    }

    // DEPOSIT
    if (transaction.type === TransactionType.DEPOSIT) {
      await this.registerCompliance(transaction, toWalletId, "LARGE_DEPOSIT", manager);
      return;
    }

    // WITHDRAW
    if (transaction.type === TransactionType.WITHDRAW) {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      const withdraws = await this.transactionRepository.findRecentWithdraws(transaction.walletId, transaction.amount, fiveMinutesAgo, manager);

      if (withdraws.length >= 3) {
        await this.registerCompliance(transaction, toWalletId, "MULTIPLE_WITHDRAWALS", manager);
    }
 } 

}
  private async registerCompliance(transaction: Transaction, toWalletId: string | null, operationType: string, manager: EntityManager): Promise<void> {
    const compliance = new ComplianceTransaction();

    compliance.amount = transaction.amount;
    compliance.operationType = operationType as any;
    compliance.sourceWallet = {id: transaction.walletId } as any;

    if (toWalletId) {
      compliance.targetWallet = {id: toWalletId} as any;
    }

    await this.complianceTransactionRepository.create(compliance, manager);
  }
}