import { TransactionDTO } from "./transaction.dto";

export interface StatementDTO {
    wallet: {
        id: string, 
        name: string, 
        balance: number
    };
    transactions: TransactionDTO[];
}