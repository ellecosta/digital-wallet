import { DataSource } from "typeorm";
import { Wallet } from "../../modules/wallet/entities/wallet.entity";
import {
  Transaction,
  TransactionType,
} from "../../modules/wallet/entities/transaction.entity";
import {
  ComplianceTransaction,
  ComplianceOperationType,
} from "../../modules/wallet/entities/compliance.transaction.entity";

function generateCpf(): string {
  return String(Math.floor(Math.random() * 1_000_000_00000)).padStart(11, "0");
}

export async function createWallet(
  dataSource: DataSource,
  overrides: Partial<Wallet> = {},
): Promise<Wallet> {
  const repo = dataSource.getRepository(Wallet);

  const wallet = repo.create({
    cpf: generateCpf(),
    name: "Test User",
    password: "hashed_password",
    balance: 0,
    ...overrides,
  });

  return await repo.save(wallet);
}

export async function createTransaction(
  dataSource: DataSource,
  overrides: Partial<Transaction> = {},
): Promise<Transaction> {
  const repo = dataSource.getRepository(Transaction);

  const type = overrides.type ?? TransactionType.TRANSFER;

  let fromWallet = overrides.fromWallet;
  let toWallet = overrides.toWallet;

  if (type === TransactionType.TRANSFER) {
    fromWallet = fromWallet || (await createWallet(dataSource));
    toWallet = toWallet || (await createWallet(dataSource));
  }

  if (type === TransactionType.DEPOSIT) {
    toWallet = toWallet || (await createWallet(dataSource));
    fromWallet = undefined;
  }

  if (type === TransactionType.WITHDRAW) {
    fromWallet = fromWallet || (await createWallet(dataSource));
    toWallet = undefined;
  }

  const transaction = repo.create({
    type,
    amount: 100,
    fromWallet,
    toWallet,
    ...overrides,
  });

  return await repo.save(transaction);
}

export async function createDeposit(
  dataSource: DataSource,
  overrides: Partial<Transaction> = {},
): Promise<Transaction> {
  return createTransaction(dataSource, {
    type: TransactionType.DEPOSIT,
    ...overrides,
  });
}

export async function createWithdraw(
  dataSource: DataSource,
  overrides: Partial<Transaction> = {},
): Promise<Transaction> {
  return createTransaction(dataSource, {
    type: TransactionType.WITHDRAW,
    ...overrides,
  });
}

export async function createTransfer(
  dataSource: DataSource,
  overrides: Partial<Transaction> = {},
): Promise<Transaction> {
  return createTransaction(dataSource, {
    type: TransactionType.TRANSFER,
    ...overrides,
  });
}

export async function createComplianceTransaction(
  dataSource: DataSource,
  overrides: Partial<ComplianceTransaction> = {},
): Promise<ComplianceTransaction> {
  const repo = dataSource.getRepository(ComplianceTransaction);

  const sourceWallet =
    overrides.sourceWallet || (await createWallet(dataSource));

  const targetWallet =
    overrides.targetWallet !== undefined ? overrides.targetWallet : undefined;

  const compliance = repo.create({
    operationType: ComplianceOperationType.LARGE_TRANSFER,
    amount: 1000,
    sourceWallet,
    targetWallet,
    ...overrides,
  });

  return await repo.save(compliance);
}

export async function createLargeTransferCompliance(
  dataSource: DataSource,
  overrides: Partial<ComplianceTransaction> = {},
): Promise<ComplianceTransaction> {
  return createComplianceTransaction(dataSource, {
    operationType: ComplianceOperationType.LARGE_TRANSFER,
    ...overrides,
  });
}

export async function createDepositCompliance(
  dataSource: DataSource,
  overrides: Partial<ComplianceTransaction> = {},
): Promise<ComplianceTransaction> {
  return createComplianceTransaction(dataSource, {
    operationType: ComplianceOperationType.LARGE_DEPOSIT,
    ...overrides,
  });
}

export async function createMultipleWithdrawalsCompliance(
  dataSource: DataSource,
  overrides: Partial<ComplianceTransaction> = {},
): Promise<ComplianceTransaction> {
  return createComplianceTransaction(dataSource, {
    operationType: ComplianceOperationType.MULTIPLE_WITHDRAWALS,
    ...overrides,
  });
}
