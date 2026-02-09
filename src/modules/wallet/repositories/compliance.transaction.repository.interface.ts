import { ComplianceTransaction } from "../entities/compliance.transaction.entity";

export interface IComplianceTransactionRepository {
    create(complianceTransaction: ComplianceTransaction): Promise<ComplianceTransaction>;
    findAll(): Promise<ComplianceTransaction[]>;
}