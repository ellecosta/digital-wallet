import { Router } from 'express';
import { StatementController} from '../controllers/statement.controller';
import { StatementService } from '../services/statement.service';
import { TypeOrmWalletRepository } from '../repositories/wallet.repository';
import { TypeOrmTransactionRepository } from '../repositories/transaction.repository';

const router = Router();

const walletRepository = new TypeOrmWalletRepository();
const transactionRepository = new TypeOrmTransactionRepository();
const statementService = new StatementService(transactionRepository, walletRepository);
const statementController = new StatementController(statementService);

router.get(
    "/:id/",
    statementController.getStamementByPeriod.bind(statementController)
);

export default router;