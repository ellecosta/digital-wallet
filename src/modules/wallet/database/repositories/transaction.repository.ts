import { Repository } from "typeorm";
import { Transaction } from "../../entities/transaction.entity";
import { ITransactionRepository } from "../../repositories/transaction.repository.interface";
import { AppDataSource } from "./data.source";

export class TypeOrmTransactionRepository implements ITransactionRepository {
    private repository: Repository<Transaction>;

    constructor() {
        this.repository = AppDataSource.getRepository(Transaction);
    }

    async create(transaction: Transaction): Promise<Transaction> { 
        return await this.repository.save(transaction);
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
}