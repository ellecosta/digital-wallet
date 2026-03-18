import { StatementDTO } from "../dtos/statement.dto";

export interface IStatementService {
    getStatementByPeriod(walletId: string, period: number): Promise<StatementDTO | null>;
}

