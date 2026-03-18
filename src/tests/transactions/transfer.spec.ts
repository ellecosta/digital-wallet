import { Transfer } from "../../modules/wallet/transactions/transfer.class";

describe("Transfer", () => {
    const sourceWalletId = "123e4567-e89b-12d3-a456-426614174000"; 
    const destinationWalletId = "9f1c2b4a-7d83-4e6f-b2c9-5a8d3e1f7c62"

        // VALIDATE
    
        it("should throw error if amount doesn't reach the minimum value", () => {
            const transfer = new Transfer(sourceWalletId, destinationWalletId, 3);;
            expect(() => transfer.validate()).toThrow();
        });

        it("should pass if amount is above the minimum value", () => {
            const transfer = new Transfer(sourceWalletId, destinationWalletId, 10);;
            expect(() => transfer.validate()).not.toThrow();
        });

        it("should throw an error when source and destination wallets are the same", () => {
            const transfer = new Transfer(sourceWalletId, sourceWalletId, 100);
            expect(() => transfer.validate()).toThrow("Source and destination wallets must be different");
        });

        // COMPLIANCE

        it("should require compliance for transfers above 5k", () => {
            const transfer = new Transfer(sourceWalletId, sourceWalletId, 6_000);
            expect(transfer.shouldCheckCompliance()).toBe(true);});

        // ADITIONAL DATA
        
        it("should return correct additional data without compliance", () => {
            const transfer = new Transfer(sourceWalletId, sourceWalletId, 4_000);
            const data = transfer.getAdditionalData();
            expect(data).toEqual({
                complianceReason: null
            });    
        });
        
        it("should return correct additional data with compliance", () => {
            const transfer = new Transfer(sourceWalletId, sourceWalletId, 6_000);
            const data = transfer.getAdditionalData();
            expect(data).toEqual({
                complianceReason: 'Transfer above $5,000' 
            });
        });

        it("should convert transfer to object correctly", () => {
            const transfer = new Transfer(sourceWalletId, destinationWalletId, 100);
            const result = transfer.toObject();
            expect(result).toMatchObject({
                walletId: sourceWalletId,
                amount: 100,
                type: "TRANSFER",
                destinationWalletId: destinationWalletId,
            });
        });
});