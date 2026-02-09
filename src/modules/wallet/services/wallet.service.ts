import { Wallet } from '../entities/wallet.entity';
import { IWalletService } from './wallet.service.interface';
import { IWalletRepository } from '../repositories/wallet.repository.interface';
import * as bcrypt from "bcrypt";

export class WalletService implements IWalletService {
    constructor(private walletRepository: IWalletRepository) {}

    async createWallet(
        name: string,
        cpf: string,
        password: string
    ): Promise<Wallet> {
        const hashedPassword = await bcrypt.hash(password, 10);

        const wallet = new Wallet();
        wallet.name = name;
        wallet.cpf = cpf;
        wallet.password = hashedPassword;
        wallet.balance = 0;

        return await this.walletRepository.create(wallet);

    }

    async getWalletById(id: string): Promise<Wallet | null> {
        return await this.walletRepository.findById(id);
    }
}