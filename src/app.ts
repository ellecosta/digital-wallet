import express from "express";
import walletRoutes from "./modules/wallet/routes/wallet.routes";
import transactionRoutes from "./modules/wallet/routes/transaction.routes";

const app = express();

app.use(express.json());

// routes
app.use("/wallets", walletRoutes);
app.use("/transactions", transactionRoutes);

export default app;
