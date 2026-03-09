import { Wallet } from '../entities/wallet.entity';
import { Transaction } from '../entities/transaction.entity';
import { IWalletService } from './wallet.service.interface';
import { IWalletRepository } from '../repositories/wallet.repository.interface';
import { StatementDTO } from '../dtos/statement.dto';
import { IStatementService } from './statement.service.interface';
import { ITransactionRepository } from '../repositories/transaction.repository.interface';

export class StatementService implements IStatementService {
    constructor(
        private transactionRepository: ITransactionRepository,
        private walletRepository: IWalletRepository
    ) {}

    async getStatementByPeriod(walletId: string, period: number): Promise<StatementDTO | null> {
        const wallet = await this.walletRepository.findById(walletId);

        if (!wallet) {
            throw new Error("Wallet not found");
        }

        const startDate = new Date();
        const endDate = new Date();

        startDate.setDate(startDate.getDate() - period);

        const transactions = await this.transactionRepository.findByWalletIdAndPeriod(walletId, startDate, endDate);
        return this.toDTO(wallet, transactions);      
    }

    private toDTO(wallet: Wallet, transactions: Transaction[]): StatementDTO {
        return {
            wallet: {
                id: wallet.id,
                name: wallet.name,
                balance: wallet.balance
            },
            transactions: transactions.map((t) => ({
                id: t.id,
                walletId: t.fromWallet?.id ?? t.toWallet?.id,
                amount: t.amount,
                type: t.type,
                date: t.createdAt
            }))
        };
    }
}
