import {Request, Response} from 'express';
import { ITransactionService } from '../services/transaction.service.interface';
import { 
    TransactionBody, 
    TransferBody,  
} from '../types/transaction.types';

import { WalletIdParams } from '../types/wallet.types';

import { 
    transactionSchema,
    transferSchema,
 } from '../schemas/transaction.schemas';

export class TransactionController {
    constructor(private transactionService: ITransactionService) {}

    async deposit(req: Request<WalletIdParams, {}, TransactionBody>, res: Response) {
        try {
            const walletId = req.params.id;
            const data = transactionSchema.parse(req.body);
            const transaction = await this.transactionService.deposit(walletId, data.amount);
            return res.status(201).json(transaction);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async withdraw(req: Request<WalletIdParams, {}, TransactionBody>, res: Response) {
        try {
            const walletId = req.params.id;
            const data = transactionSchema.parse(req.body);
            const transaction = await this.transactionService.withdraw(walletId, data.amount);
            return res.status(201).json(transaction);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async transfer(req: Request<WalletIdParams, {}, TransferBody>, res: Response) {
        try {
            const fromWalletId = req.params.id;
            const data = transferSchema.parse(req.body);
            const transaction = await this.transactionService.transfer(fromWalletId, data.toWalletId, data.amount);
            return res.status(201).json(transaction);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getTransactionsByWalletId(req: Request<WalletIdParams>, res: Response) {
        try {
            const walletId = req.params.id;
            const transactions = await this.transactionService.getTransactionsByWalletId(walletId);
            return res.json(transactions);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }   
    }
}