import { WalletDTO } from "../dtos/wallet.dto";
import { Wallet } from "../entities/wallet.entity";

export interface IWalletService {
    createWallet(
        name: string,
        cpf: string,
        password: string
    ): Promise<WalletDTO>;

    getWalletById(id: string): Promise<WalletDTO>;
}