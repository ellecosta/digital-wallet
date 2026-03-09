import { z } from "zod";
import { ComplianceOperationType } from "../entities/compliance.transaction.entity";

export const complianceQuerySchema = z.object({
  type: z.nativeEnum(ComplianceOperationType).optional(),
  walletId: z.string().uuid("Invalid wallet ID format").optional(),
});