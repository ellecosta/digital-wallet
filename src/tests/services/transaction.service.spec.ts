import { TransactionService } from "../../modules/wallet/services/transaction.service";
import { FakeTransactionProcessor } from "../fakes/fake-transaction-processor-class";
import { FakeTransactionRepository } from "../fakes/fake-transaction-repository";

describe("TransactionService", () => {
    let transactionService: TransactionService;
    let fakeTransactionProcessor: FakeTransactionProcessor;
    let fakeTransactionRepo: FakeTransactionRepository;

    beforeEach(() => {
        fakeTransactionProcessor = new FakeTransactionProcessor();
        fakeTransactionRepo =  new FakeTransactionRepository();
        transactionService =  new TransactionService(fakeTransactionRepo as any, fakeTransactionProcessor as any);
    });

    const walletId = "123e4567-e89b-12d3-a456-426614174000"; 
    const destinationWalletId = "9f1c2b4a-7d83-4e6f-b2c9-5a8d3e1f7c62"

    it("should call transaction processor with deposit", async () => {
        await transactionService.deposit(walletId, 200);
        expect(fakeTransactionProcessor.processedTransactions.length).toBe(1);
        expect(fakeTransactionProcessor.processedTransactions[0].amount).toBe(200);
    });

    it("should return DTO with correct fields on deposit", async () => {
        const result = await transactionService.deposit(walletId, 200);

        expect(result).toBeDefined();

        expect(result).toMatchObject({
        walletId: walletId,
        amount: 200,
        type: "DEPOSIT",
        });

        expect(result).toHaveProperty("id");
        expect(result).toHaveProperty("date");

    });

    it("should call transaction processor with withdraw", async () => {
        await transactionService.withdraw(walletId, 200);
        expect(fakeTransactionProcessor.processedTransactions.length).toBe(1);
        expect(fakeTransactionProcessor.processedTransactions[0].amount).toBe(200);
    });

    it("should return DTO with correct fields for withdraw", async () => {
        const result = await transactionService.withdraw(walletId, 200);

        expect(result).toBeDefined();

        expect(result).toMatchObject({
            walletId: walletId,
            amount: 200,
            type: "WITHDRAW",
        });

        expect(result).toHaveProperty("id");
        expect(result).toHaveProperty("date");
    });

    
    it("should call transaction processor with transfer", async () => {
        await transactionService.transfer(walletId, destinationWalletId, 300);
        expect(fakeTransactionProcessor.processedTransactions.length).toBe(1);
        expect(fakeTransactionProcessor.processedTransactions[0].amount).toBe(300);
    });

    it("should return DTO with correct fields for transfer", async () => {
        const result = await transactionService.transfer(walletId, destinationWalletId, 300);

        expect(result).toBeDefined();

        expect(result).toMatchObject({
            walletId: walletId,
            amount: 300,
            type: "TRANSFER",
        });

        expect(result).toHaveProperty("id");
        expect(result).toHaveProperty("date");
    });

    it("should call repository with walletId", async () => {
        const result = await transactionService.getTransactionsByWalletId(walletId);
        expect(result).toBeDefined();
    });

    it("should return transactions filtered by walletId", async () => {
        const otherWalletId = "987e6543-e21b-45d3-b123-426614174999";

        await fakeTransactionRepo.create({
            id: "t1",
            fromWallet: { id: walletId },
            amount: 100,
            type: "DEPOSIT",
            date: new Date(),
        });

        await fakeTransactionRepo.create({
            id: "t2",
            fromWallet: { id: otherWalletId },
            amount: 50,
            type: "WITHDRAW",
            date: new Date(),
        });

        const result = await transactionService.getTransactionsByWalletId(walletId);

        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
            walletId: walletId,
            amount: 100,
            type: "DEPOSIT",
        });
    });
});