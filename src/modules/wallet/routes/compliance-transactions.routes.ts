import { Router } from "express";
import { ComplianceTransactionController } from "../controllers/compliance-transaction.controller"; 
import { ComplianceTransactionService } from "../services/compliance-transaction.service";
import { TypeOrmComplianceTransactionRepository } from "../repositories/compliance.transaction.repository";

const router = Router();

const complianceRepository =
  new TypeOrmComplianceTransactionRepository();

const complianceService =
  new ComplianceTransactionService(complianceRepository);

const complianceController =
  new ComplianceTransactionController(complianceService);

router.get(
  "/",
  complianceController.getAll.bind(complianceController)
);

export default router;