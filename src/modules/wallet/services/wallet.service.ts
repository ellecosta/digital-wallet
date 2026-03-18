import { Wallet } from '../entities/wallet.entity';
import { IWalletService } from './wallet.service.interface';
import { IWalletRepository } from '../repositories/wallet.repository.interface';
import * as bcrypt from "bcrypt";
import { WalletDTO } from '../dtos/wallet.dto';

export class WalletService implements IWalletService {
    constructor(private walletRepository: IWalletRepository) {}

    async createWallet(name: string, cpf: string, password: string): Promise<WalletDTO> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const wallet = new Wallet();
        wallet.name = name;
        wallet.cpf = cpf;
        wallet.password = hashedPassword;
        wallet.balance = 0;

        await this.walletRepository.create(wallet);

        return this.toDTO(wallet)
    }

    async getWalletById(id: string): Promise<WalletDTO> {
        const wallet = await this.walletRepository.findById(id);

        if (!wallet) {
            throw new Error("Wallet not found");
        }

        return this.toDTO(wallet)
    }

    private toDTO(wallet: Wallet): WalletDTO {
        return {
            id: wallet.id,
            name: wallet.name,
            cpf: wallet.cpf,
            balance: wallet.balance,
            createdAt: wallet.createdAt
        }
    }
}