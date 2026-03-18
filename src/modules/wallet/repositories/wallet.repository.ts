import { Repository } from "typeorm";
import { Wallet } from "../entities/wallet.entity";
import { IWalletRepository } from "./wallet.repository.interface";
import { AppDataSource } from "../database/data.source";

export class TypeOrmWalletRepository implements IWalletRepository {
    private repository: Repository<Wallet>; 

    constructor() {
        this.repository = AppDataSource.getRepository(Wallet);
    }

    // Create new wallet
    async create(wallet: Wallet): Promise<Wallet> {
        return await this.repository.save(wallet);
    }

    async findById(id: string): Promise<Wallet | null> {
        return await this.repository.findOneBy({ id });
    }
    
    // Update existing wallet
    async save(wallet: Wallet): Promise<Wallet> {
        return await this.repository.save(wallet);
    }   
} 

    