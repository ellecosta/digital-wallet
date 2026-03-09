import { ComplianceTransactionDTO } from "../dtos/compliance-transaction.dto";

export interface IComplianceTransactionService {
    getAll(): Promise<ComplianceTransactionDTO[]>;
}