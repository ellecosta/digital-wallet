import { TransactionProcessor } from "../../modules/wallet/transactions/transaction.processor.class";
import { Deposit } from "../../modules/wallet/transactions/deposit.class";
import { Withdraw } from "../../modules/wallet/transactions/withdraw.class";
import { Transfer } from "../../modules/wallet/transactions/transfer.class";

import { FakeWalletRepository } from "../fakes/fake-wallet-repository";
import { FakeTransactionRepository } from "../fakes/fake-transaction-repository";
import { FakeComplianceRepository } from "../fakes/fake-compliance-transaction-repository";

describe("TransactionProcessor", () => {
    let fakeWalletRepo: FakeWalletRepository;
    let fakeTransactionRepo: FakeTransactionRepository;
    let fakeComplianceRepo:FakeComplianceRepository;
    let processor: TransactionProcessor;

    const walletId = "123e4567-e89b-12d3-a456-426614174000"; 
    const destinationWalletId = "9f1c2b4a-7d83-4e6f-b2c9-5a8d3e1f7c62"

    beforeEach(() => {
        fakeTransactionRepo = new FakeTransactionRepository();
        fakeComplianceRepo = new FakeComplianceRepository();
        fakeWalletRepo = new FakeWalletRepository();

        processor = new TransactionProcessor(
            fakeTransactionRepo as any,
            fakeComplianceRepo  as any,
            fakeWalletRepo as any
        );
    });

    it("should increase wallet balance on deposit", async () => {
        const wallet = { id: walletId, balance: 100 };
        fakeWalletRepo.wallets.push(wallet);

        const deposit = new Deposit(walletId, 50);

        await processor.process(deposit);

        expect(wallet.balance).toBe(150);
    });

    it("should throw error if wallet not found", async () => {
        const deposit = new Deposit(walletId, 100);

        await expect(processor.process(deposit)).rejects.toThrow("Wallet not found");
    });

    it("should decrease balance on withdraw", async () => {
        const wallet = { id: walletId, balance: 200 };
        fakeWalletRepo.wallets.push(wallet);

        const withdraw = new Withdraw(walletId, 50);

        await processor.process(withdraw);

        expect(wallet.balance).toBe(150);
    })

    it("should throw error if insufficient balance", async () => {
        const wallet = { id: walletId, balance: 50 };
        fakeWalletRepo.wallets.push(wallet);

        const withdraw = new Withdraw(walletId, 100);

        await expect(processor.process(withdraw)).rejects.toThrow("Insufficient balance");
    });

    it("should transfer between wallets", async () => {
        const sourceWallet = { id: walletId, balance: 200};
        const destinationWallet = { id: destinationWalletId, balance: 50};

        fakeWalletRepo.wallets.push(sourceWallet);
        fakeWalletRepo.wallets.push(destinationWallet);

        const transfer = new Transfer(walletId, destinationWalletId, 100);

        await processor.process(transfer);

        expect(sourceWallet.balance).toBe(100);
        expect(destinationWallet.balance).toBe(150);
    });

    it("should throw error if destination wallet not found", async () => {
        const source = { id: walletId, balance: 200 };
        fakeWalletRepo.wallets.push(source);

        const transfer = new Transfer(walletId, destinationWalletId, 100);

        await expect(processor.process(transfer)).rejects.toThrow("Destination wallet not found");
    });

    it("should save transaction", async () => {
        const wallet = { id: walletId, balance: 100 };
        fakeWalletRepo.wallets.push(wallet);

        const deposit = new Deposit(walletId, 50);

        await processor.process(deposit);

        expect(fakeTransactionRepo.transactions.length).toBe(1);
    });

    it("should register compliance after multiple withdraws", async () => {
        const wallet = { id: walletId, balance: 1000 };
        fakeWalletRepo.wallets.push(wallet);

        fakeTransactionRepo.transactions.push(
        {
            fromWallet: { id: walletId },
            type: "WITHDRAW",
            amount: 100,
            createdAt: new Date()
        },

        {
            fromWallet: { id: walletId },
            type: "WITHDRAW",
            amount: 100,
            createdAt: new Date()
        }
        );

        const withdraw = new Withdraw(walletId, 100);

        await processor.process(withdraw);

        expect(fakeComplianceRepo.records.length).toBe(1);
    });
    
    it("should throw error if transaction validation fails", async () => {
        const wallet = { id: walletId, balance: 1000 };
        fakeWalletRepo.wallets.push(wallet);

        const withdraw = new Withdraw(walletId, 20_000);

        await expect(processor.process(withdraw)).rejects.toThrow();
    });
});