import request from "supertest";
import { AppDataSource } from "../../modules/wallet/database/data.source";
import { clearDatabase } from "../helpers/db.helper";
import { createWallet } from "../helpers/seed.helper";
import app  from "../../app"

// depósito, saque, transferência (incluindo cenários de saldo insuficiente e race condition)

describe("Transaction Integration", () => {
    beforeEach(async () => {
        await clearDatabase(AppDataSource);
    });

    it("should create a transfer transaction", async () => {
        // Arrange
        const fromWallet = await createWallet(AppDataSource, { balance: 100, });

        const toWallet = await createWallet(AppDataSource, { balance: 0, });

        // Act 
        const response = (await request(app).post(`/transactions/${fromWallet.id}/transfer`).send({fromWalletId: fromWallet.id, toWalletId: toWallet.id, amount: 50, }));
        
        // Assert (API)

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");

        // Assert (Database)

        const transactionRepo = AppDataSource.getRepository("transactions");
        const walletRepo = AppDataSource.getRepository("wallets");

        const transaction = await transactionRepo.findOneBy({
            id: response.body.id,
        });

        expect(transaction).not.toBeNull();
        expect(Number(transaction!.amount)).toBe(50);

        const updatedFrom = await walletRepo.findOneBy({ id: fromWallet.id});
        const updatedTo = await walletRepo.findOneBy({ id: toWallet.id});

        expect(Number(updatedFrom!.balance)).toBe(50);
        expect(Number(updatedTo!.balance)).toBe(50);
    });

    it("should deposit money", async () => {
        // Arrange
        const wallet = await createWallet(AppDataSource, { balance: 0, });

        // Act
        const response = await request(app).post(`/transactions/${wallet.id}/deposit`).send({ walletId: wallet.id, amount: 100});

        // Assert 
        expect(response.status).toBe(201);

        const repo = AppDataSource.getRepository("wallets");
        const updated = await repo.findOneBy( { id: wallet.id });

        expect(Number(updated!.balance)).toBe(100);
    });

    it("should withdraw money", async () => {
        // Arrange
        const wallet = await createWallet(AppDataSource, { balance: 100, });

        // Act
        const response = await request(app).post(`/transactions/${wallet.id}/withdraw`).send({ walletId: wallet.id, amount: 30});

        // Assert 
        expect(response.status).toBe(201);

        const repo = AppDataSource.getRepository("wallets");
        const updated = await repo.findOneBy( { id: wallet.id });

        expect(Number(updated!.balance)).toBe(70);
    });

    it("should not allow withdraw with insufficient balance", async () => {
        // Arrange
        const wallet = await createWallet(AppDataSource, { balance: 10, });

        // Act
        const response = await request(app).post(`/transactions/${wallet.id}/withdraw`).send({ walletId: wallet.id, amount: 100});

        expect(response.status).toBe(400);
    });

    it("should not allow two concurrent withdrawals to overdraft", async () => {
        // Arrange
        const wallet = await createWallet(AppDataSource, { balance: 100});
 
        // Act
        const [res1, res2] = await Promise.all([
            request(app).post(`/transactions/${wallet.id}/withdraw`).send({ walletId: wallet.id, amount: 100}),
            request(app).post(`/transactions/${wallet.id}/withdraw`).send({ walletId: wallet.id, amount: 100}),
        ]);

        const statuses = [res1.status, res2.status];

        // Assert
        expect(statuses).toContain(201);
        expect(statuses).toContain(400);

        const repo = AppDataSource.getRepository("wallets");
        const updated = await repo.findOneBy({ id: wallet.id });
        expect(Number(updated!.balance)).toBe(0);
    });

    it("should rollback source wallet balance if transfer fails", async () => {
        // Arrange
        const fromWallet = await createWallet(AppDataSource, { balance: 100});
        const nonExistentWalletId = "00000000-0000-0000-0000-000000000000";

        // Act
        const response = await request(app).post(`/transactions/${fromWallet.id}/transfer`).send({
            fromWalletId: fromWallet.id,
            toWalletId: nonExistentWalletId,
            amount: 50,
        });

        // Assert
        expect(response.status).toBe(400);

        const repo = AppDataSource.getRepository("wallets");
        const updated = await repo.findOneBy({ id: fromWallet.id});
        expect(Number(updated!.balance)).toBe(100);

        const transactionRepo = AppDataSource.getRepository("transactions");
        const transactions = await transactionRepo.find();
        expect(transactions).toHaveLength(0);
    });
});
