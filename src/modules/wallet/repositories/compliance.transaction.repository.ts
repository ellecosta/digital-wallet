import { Repository } from "typeorm";
import { ComplianceTransaction } from "../entities/compliance.transaction.entity";
import { IComplianceTransactionRepository } from "./compliance.transaction.repository.interface";
import { AppDataSource } from "../database/data.source";
import { EntityManager } from "typeorm";

export class TypeOrmComplianceTransactionRepository implements IComplianceTransactionRepository {
    private repository: Repository<ComplianceTransaction>;

    constructor() {
        this.repository = AppDataSource.getRepository(ComplianceTransaction);
    }

    async create(complianceTransaction: ComplianceTransaction, manager?: EntityManager): Promise<ComplianceTransaction> {
        const repo = manager ? manager.getRepository(ComplianceTransaction) : this.repository;
        return await repo.save(complianceTransaction);
    }

    async findAll(): Promise<ComplianceTransaction[]> { 
        return await this.repository.find({
            order: { createdAt: "DESC" }
        });
    }
}