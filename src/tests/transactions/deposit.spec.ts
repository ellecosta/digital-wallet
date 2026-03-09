import { Deposit } from "../../modules/wallet/transactions/deposit.class";

describe("Deposit", () => {
    const walletId = "123e4567-e89b-12d3-a456-426614174000"; 
    // VALIDATE

    it("should throw error if amount exceeds max limit", () => {
        const deposit = new Deposit(walletId, 2_000_000);
        expect(() => deposit.validate()).toThrow();
    });

    it("should pass if amount is below max limit", () => {
        const deposit = new Deposit(walletId, 5_000);
        expect(() => deposit.validate()).not.toThrow();
    });

    //  COMPLIANCE

    it("should not require compliance for small deposits", () => {
        const deposit = new Deposit(walletId, 50_000);
        expect(deposit.requiresCompliance()).toBe(false);
    });

    it("should require compliance for deposits above 100k", () => {
        const deposit = new Deposit(walletId, 150_000);
        expect(deposit.requiresCompliance()).toBe(true);
    });

    // ADITIONAL DATA

    it("should return correct additional data without compliance", () => {
        const deposit = new Deposit(walletId, 10_000);
        const data = deposit.getAdditionalData();
        expect(data).toEqual({
            requiresCompliance: false,
            complianceReason: null
        });
    });

    it("should return correct additional data with compliance", () => {
        const deposit = new Deposit(walletId, 200_000);
        const data = deposit.getAdditionalData();
        expect(data).toEqual({
            requiresCompliance: true,
            complianceReason: 'Deposit above $100,000'
        });
    });
});
