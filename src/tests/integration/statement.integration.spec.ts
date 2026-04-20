import request from "supertest";
import { AppDataSource } from "../../modules/wallet/database/data.source";
import { clearDatabase } from "../helpers/db.helper";
import { createWallet } from "../helpers/seed.helper";
import app  from "../../app"

describe("Statement Integration", () => {
    beforeEach(async () => {
        await clearDatabase(AppDataSource);
    });

    it("should return statement with transactions within period", async () => {
        const wallet = await createWallet(AppDataSource, { balance: 500});

        await request(app).post(`/transactions/${wallet.id}/deposit`).send({ walletId: wallet.id, amount: 500});

        const response = await request(app).get(`/statement/${wallet.id}?period=7`);
        
        expect(response.status).toBe(200);
        expect(response.body.wallet).toMatchObject({
            id: wallet.id,
            name: wallet.name,
        });

        expect(Number(response.body.wallet.balance)).toBe(1000);
        expect(response.body.transactions).toHaveLength(1);
        expect(response.body.transactions[0]).toMatchObject({
            type: "DEPOSIT",
        });

        expect(Number(response.body.transactions[0].amount)).toBe(500);
    }); 

    it("should return empty transactions for wallet with no transactions", async () => {
        const wallet = await createWallet(AppDataSource, { balance: 0 });

        const response = await request(app).get(`/statement/${wallet.id}?period=30`);

        expect(response.status).toBe(200);
        expect(response.body.transactions).toHaveLength(0);
    });
});