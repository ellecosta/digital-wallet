import { Repository } from "typeorm";
import { Between, MoreThanOrEqual} from "typeorm";
import { Transaction } from "../entities/transaction.entity";
import { ITransactionRepository } from "./transaction.repository.interface";
import { TransactionType } from "../entities/transaction.entity";
import { AppDataSource } from "../database/data.source";
import { EntityManager } from "typeorm";

export class TypeOrmTransactionRepository implements ITransactionRepository {
    private repository: Repository<Transaction>;

    constructor() {
        this.repository = AppDataSource.getRepository(Transaction);
    }

    async create(transaction: Transaction, manager?: EntityManager): Promise<Transaction> { 
        const repo = manager ? manager.getRepository(Transaction) : this.repository;
        return await repo.save(transaction);
    }   

    async findByWalletId(walletId: string): Promise<Transaction[]> {
        return await this.repository.find({
            where: [
                { fromWallet: { id: walletId } },
                { toWallet: { id: walletId } }
            ],
            relations: ["fromWallet", "toWallet"],
            order: { createdAt: "DESC" }
        });
    }

    async findByWalletIdAndPeriod(walletId: string, startDate: Date): Promise<Transaction[]> {
        return await this.repository.find({
            where: [
                {
                    fromWallet: { id: walletId},
                    createdAt: MoreThanOrEqual(startDate)
                },
                {
                    toWallet: { id: walletId},
                    createdAt: MoreThanOrEqual(startDate)
                }
            ],
            relations: ["fromWallet", "toWallet"],
            order: { createdAt: "DESC" }
        })
    }

    async findRecentWithdraws(walletId: string, amount: number, startDate: Date, manager?: EntityManager): Promise<Transaction[]> {
        const repo = manager ? manager.getRepository(Transaction) : this.repository;
        return await repo.find({
            where: {
                fromWallet: { id: walletId },
                type: TransactionType.WITHDRAW,
                amount,
                createdAt: MoreThanOrEqual(startDate),
            },
        });
    }  
}