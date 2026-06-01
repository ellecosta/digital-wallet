import { Wallet } from "../entities/wallet.entity";
import { EntityManager } from "typeorm";

export interface IWalletRepository {
  create(wallet: Wallet): Promise<Wallet>;
  findById(id: string, manager?: EntityManager): Promise<Wallet | null>;
  save(wallet: Wallet, manager?: EntityManager): Promise<Wallet>;
}
