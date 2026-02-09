import { Request, Response } from 'express';
import { IWalletService } from '../services/wallet.service.interface';

export class WalletController {
    constructor(private walletService: IWalletService) {}

    async createWallet(req: Request, res: Response) {
        try {
            const { name, cpf, password } = req.body;
            const wallet = await this.walletService.createWallet(name, cpf, password);
            return res.status(201).json(wallet);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getWalletById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const wallet = await this.walletService.getWalletById(id);
            if (!wallet) {
                return res.status(404).json({ error: 'Wallet not found' });
            }
            return res.json(wallet); 
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
