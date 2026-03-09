import { ComplianceOperationType } from "../entities/compliance.transaction.entity";

export interface ComplianceTransactionDTO {
  id: string;
  operationType: ComplianceOperationType;
  amount: number;
  sourceWalletId: string;
  targetWalletId?: string | null;
  createdAt: Date;
}