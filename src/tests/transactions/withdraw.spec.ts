import { Withdraw } from "../../modules/wallet/transactions/withdraw.class";

describe("Withdraw", () => {
    const walletId = "123e4567-e89b-12d3-a456-426614174000"; 
    // VALIDATE

    it("should throw error if amount is above maximum value", () => {
        const withdraw = new Withdraw(walletId, 20_000);
        expect(() => withdraw.validate()).toThrow();
    });

    it("should pass if amount is below the maximum value", () => {
        const withdraw = new Withdraw(walletId, 5_000);
        expect(() => withdraw.validate()).not.toThrow();
    });


    // COMPLIANCE

});