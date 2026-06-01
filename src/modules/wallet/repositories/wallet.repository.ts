import { Repository, EntityManager } from "typeorm";
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

  async findById(id: string, manager?: EntityManager): Promise<Wallet | null> {
    const repo = manager ? manager.getRepository(Wallet) : this.repository;
    return await repo.findOne({
      where: { id },
      ...(manager ? { lock: { mode: "pessimistic_write" } } : {}),
    });
  }

  // Update existing wallet
  async save(wallet: Wallet, manager?: EntityManager): Promise<Wallet> {
    const repo = manager ? manager.getRepository(Wallet) : this.repository;
    return await repo.save(wallet);
  }
}
