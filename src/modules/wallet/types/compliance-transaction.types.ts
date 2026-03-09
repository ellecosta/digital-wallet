import { ComplianceOperationType } from "../entities/compliance.transaction.entity";

export interface ComplianceQuery {
  type?: ComplianceOperationType;
  walletId?: string;
}