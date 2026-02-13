import { Router } from 'express';
import { WalletController} from '../controllers/wallet.controller';
import { WalletService } from '../services/wallet.service';
import { TypeOrmWalletRepository } from '../repositories/wallet.repository';

const router = Router();

const walletRepository = new TypeOrmWalletRepository();
const walletService = new WalletService(walletRepository);
const walletController = new WalletController(walletService);

router.post(
    "/",
    walletController.createWallet.bind(walletController)
);

router.get(
    "/:id",
    walletController.getWalletById.bind(walletController)
);

export default router;