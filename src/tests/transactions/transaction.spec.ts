import { TransactionType } from "../../modules/wallet/entities/transaction.entity";
import { Transaction } from "../../modules/wallet/transactions/transaction.class"

class TestTransaction extends Transaction {
    validate(): void {}

    async execute(): Promise<{ targetWalletId: string | null }> {
        return { targetWalletId: null };
    }

    shouldCheckCompliance(): boolean {
        return false;
    }

    getAdditionalData(): Record<string, any> {
        return {};
    }
}

describe("Transaction base validations", () => {
    const walletId = "123e4567-e89b-12d3-a456-426614174000"; 

    it("should pass validation with valid amount", () => {
        expect(() => new TestTransaction(walletId, 100, TransactionType.DEPOSIT)).not.toThrow();
    });

    it("should throw error if amount is zero", () => {
        expect(() => new TestTransaction(walletId, 0, TransactionType.DEPOSIT)).toThrow("Amount must be greater than zero");
    });

    it("should throw error if amount is negative", () => {
        expect(() => new TestTransaction(walletId, -50, TransactionType.DEPOSIT)).toThrow("Amount must be greater than zero");
    });

    it("should throw error if walletID is empty", () => {
        expect(() => new TestTransaction("", 100, TransactionType.DEPOSIT)).toThrow("Wallet ID is required");
    });

    it("should throw error if amount is NaN", () => {
        expect(() => new TestTransaction(walletId, NaN, TransactionType.DEPOSIT)).toThrow("Invalid amount");
    });   
});
