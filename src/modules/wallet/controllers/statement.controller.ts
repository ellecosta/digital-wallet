import {Request, Response} from 'express';
import { IStatementService } from '../services/statement.service.interface';
import { StatementQuery } from '../types/statement.types';
import { WalletIdParams } from '../types/wallet.types';
import { statementQuerySchema } from '../schemas/statement.schemas';

export class StatementController {
    constructor(private statementService: IStatementService) {}

    async getStatementByPeriod(req: Request<WalletIdParams, {}, {}, StatementQuery>, res: Response) {
        try {
            const walletId = req.params.id;
            const data = statementQuerySchema.parse(req.query);
            const statement = await this.statementService.getStatementByPeriod(walletId, data.period);
            return res.status(200).json(statement);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}