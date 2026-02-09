import { Wallet } from "../entities/wallet.entity";

export interface IWalletService {
    createWallet(
        name: string,
        cpf: string,
        password: string
    ): Promise<Wallet>;

    getWalletById(id: string): Promise<Wallet | null>;
}