import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { TransactionService } from '../services/transaction.service';
import { TypeOrmTransactionRepository } from '../repositories/transaction.repository';
import { TransactionProcessor } from '../transactions/transaction.processor.class';
import { TypeOrmComplianceTransactionRepository } from '../repositories/compliance.transaction.repository';
import { TypeOrmWalletRepository } from '../repositories/wallet.repository';

const router = Router();

const walletRepository = new TypeOrmWalletRepository();
const transactionRepository = new TypeOrmTransactionRepository();
const complianceTransactionRepository = new TypeOrmComplianceTransactionRepository();
const transactionProcessor = new TransactionProcessor(transactionRepository, complianceTransactionRepository, walletRepository);
const transactionService = new TransactionService(transactionRepository, transactionProcessor);
const transactionController = new TransactionController(transactionService);

router.post(
    "/:id/deposit",
    transactionController.deposit.bind(transactionController)
);

router.post(
    "/:id/withdraw",
    transactionController.withdraw.bind(transactionController)
);

router.post(
    "/:id/transfer",
    transactionController.transfer.bind(transactionController)
);

router.get(
    "/:id/transactions",
    transactionController.getTransactionsByWalletId.bind(transactionController)
);

export default router;