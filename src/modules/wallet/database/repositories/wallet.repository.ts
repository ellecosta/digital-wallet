import { Repository } from "typeorm";
import { Wallet } from "../../entities/wallet.entity";
import { IWalletRepository } from "../../repositories/wallet.repository.interface";
import { AppDataSource } from "./data.source";

export class TypeOrmWalletRepository implements IWalletRepository {
    private repository: Repository<Wallet>; 

    constructor() {
        this.repository = AppDataSource.getRepository(Wallet);
    }

    // Criar nova carteira
    async create(wallet: Wallet): Promise<Wallet> {
        return await this.repository.save(wallet);
    }

    async findById(id: string): Promise<Wallet | null> {
        return await this.repository.findOneBy({ id });
    }
    
    // Atualizar carteira existente
    async save(wallet: Wallet): Promise<Wallet> {
        return await this.repository.save(wallet);
    }   
} 

    