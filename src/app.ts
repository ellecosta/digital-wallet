import express from "express";
import walletRoutes from "./modules/wallet/routes/wallet.routes";
import transactionRoutes from "./modules/wallet/routes/transaction.routes";
import complianceTransactionRoutes from "./modules/wallet/routes/compliance-transactions.routes"
import statementRoutes from "./modules/wallet/routes/statement.routes"

const app = express();

app.use(express.json());

// routes
app.use("/wallets", walletRoutes);
app.use("/transactions", transactionRoutes);
app.use("/compliance", complianceTransactionRoutes);
app.use("/statement", statementRoutes);

export default app;
