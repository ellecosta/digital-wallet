import { IComplianceTransactionRepository } from "../repositories/compliance.transaction.repository.interface";
import { IComplianceTransactionService } from "./compliance-transaction.service.interface";
import { ComplianceTransactionDTO } from "../dtos/compliance-transaction.dto";
import { ComplianceTransaction } from "../entities/compliance.transaction.entity";

export class ComplianceTransactionService implements IComplianceTransactionService {
    constructor(
        private complianceTransactionRepo: IComplianceTransactionRepository
    ) {}

    async getAll(): Promise<ComplianceTransactionDTO[]> {
        const compliances = await this.complianceTransactionRepo.findAll();
        return compliances.map((c) => this.toDTO(c));
    }

    private toDTO(
        compliance: ComplianceTransaction): ComplianceTransactionDTO {
            return {
                id: compliance.id,
                operationType: compliance.operationType,
                amount: Number(compliance.amount),
                sourceWalletId: compliance.sourceWallet?.id ?? null,
                targetWalletId: compliance.targetWallet?.id ?? null,
                createdAt: compliance.createdAt,
        };
    }
}