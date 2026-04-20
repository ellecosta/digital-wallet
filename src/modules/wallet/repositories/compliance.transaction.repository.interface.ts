import { ComplianceTransaction } from "../entities/compliance.transaction.entity";
import { EntityManager } from "typeorm";

export interface IComplianceTransactionRepository {
    create(complianceTransaction: ComplianceTransaction, manager?: EntityManager): Promise<ComplianceTransaction>;
    findAll(): Promise<ComplianceTransaction[]>;
}