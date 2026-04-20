// - compliance.integration.spec.ts — verificar registro de compliance para transações grandes e saques múltiplos

import request from "supertest";
import { AppDataSource } from "../../modules/wallet/database/data.source";
import { clearDatabase } from "../helpers/db.helper";
import { createWallet } from "../helpers/seed.helper";
import app  from "../../app"

describe("Compliance Transaction Integration", () => {
    beforeEach(async () => {
        await clearDatabase(AppDataSource);
    });

    it("should register compliance for large deposit", async () => {
        // Arrange
        const wallet = await createWallet(AppDataSource, { balance: 0, });

        // Act
        const response = await request(app).post(`/transactions/${wallet.id}/deposit`).send({ walletId: wallet.id, amount: 150_000});

        // Assert 
        expect(response.status).toBe(201);
        const repo = AppDataSource.getRepository("compliance_transactions");
        const records = await repo.find();

        expect(records).toHaveLength(1);
        expect(records[0]).toMatchObject({
            operationType: "LARGE_DEPOSIT",
        });

        expect(Number(records[0].amount)).toBe(150_000);
    });

    it("should register compliance for multiple withdrawals", async () => {
        // Arrange
        const wallet = await createWallet(AppDataSource, { balance: 1500 });
        const amount = 500;

        // Act
        // First and second withdrawals don't trigger compliance
        await request(app).post(`/transactions/${wallet.id}/withdraw`).send({ walletId: wallet.id, amount });
        await request(app).post(`/transactions/${wallet.id}/withdraw`).send({ walletId: wallet.id, amount });

        // Third withdrawal
        const response = await request(app).post(`/transactions/${wallet.id}/withdraw`).send({ walletId: wallet.id, amount});

        // Assert
        expect(response.status).toBe(201);

        const repo = AppDataSource.getRepository("compliance_transactions");
        const record = await repo.find();

        expect(record).toHaveLength(1);
        expect(record[0]).toMatchObject({
            operationType: "MULTIPLE_WITHDRAWALS",
        });
        expect(Number(record[0].amount)).toBe(500);

    });
});