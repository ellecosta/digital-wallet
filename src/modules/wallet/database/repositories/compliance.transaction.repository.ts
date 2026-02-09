import { Repository } from "typeorm";
import { ComplianceTransaction } from "../../entities/compliance.transaction.entity";
import { IComplianceTransactionRepository } from "../../repositories/compliance.transaction.repository.interface";
import { AppDataSource } from "./data.source";

export class TypeOrmComplianceTransactionRepository implements IComplianceTransactionRepository {
    private repository: Repository<ComplianceTransaction>;

    constructor() {
        this.repository = AppDataSource.getRepository(ComplianceTransaction);
    }

    async create(complianceTransaction: ComplianceTransaction): Promise<ComplianceTransaction> {
        return await this.repository.save(complianceTransaction);
    }

    async findAll(): Promise<ComplianceTransaction[]> { 
        return await this.repository.find({
            order: { createdAt: "DESC" }
        });
    }
}