import { Request, Response } from 'express';
import { IWalletService } from '../services/wallet.service.interface';
import { 
    CreateWalletBody, 
    WalletIdParams,  
} from '../types/wallet.types';

import { 
    createWalletSchema,
    walletIdParamSchema,
 } from '../schemas/wallet.schemas';

export class WalletController {
    constructor(private walletService: IWalletService) {}

    async createWallet(req: Request<{}, {}, CreateWalletBody>, res: Response) {
        try {
            const data = createWalletSchema.parse(req.body);
            const wallet = await this.walletService.createWallet(
                data.name, 
                data.cpf, 
                data.password
            );
            return res.status(201).json(wallet);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getWalletById(req: Request<WalletIdParams>, res: Response) {
        try {
            const data = walletIdParamSchema.parse(req.params);
            const wallet = await this.walletService.getWalletById(data.id);

            if (!wallet) {
                return res.status(404).json({ error: 'Wallet not found' });
            }
            return res.json(wallet); 
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
