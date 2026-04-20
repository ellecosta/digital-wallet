import request from "supertest";
import { AppDataSource } from "../../modules/wallet/database/data.source";
import { clearDatabase } from "../helpers/db.helper";
import { createWallet } from "../helpers/seed.helper";
import app  from "../../app"

describe("Wallet Integration", () => {
    beforeEach(async () => {
        await clearDatabase(AppDataSource);
    });

    it("should create wallet", async () => {
        //  Arrange
        const payload = {
            cpf: "52998224725",
            name: "Giselle",
            password: "123456" 
        };

        // Act
        const response = await request(app).post("/wallets").send(payload);

        // Assert (API)
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.name).toBe(payload.name);
        expect(response.body.cpf).toBe(payload.cpf);

        // Assert (Database)
        const repo = AppDataSource.getRepository("wallets");

        const walletIdDb = await repo.findOneBy({
            id: response.body.id,
        });

        expect(walletIdDb).not.toBeNull();
        expect(walletIdDb!.name).toBe(payload.name);
    });

    it("should get wallet by id", async () => {
        // Arrange
        const wallet = await createWallet(AppDataSource, {
            name: "Test User",
        });

        // Act
        const response = await request(app).get(`/wallets/${wallet.id}`);
        
        // Assert
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(wallet.id);
        expect(response.body.name).toBe(wallet.name);
    });

    it("should return 404 when wallet does not exist", async () => {
        // Arrange
        const fakeId = "00000000-0000-0000-0000-000000000000";

        // Act 
        const response = await request(app).get(`/wallets/${fakeId}`);

        // Assert
        expect(response.status).toBe(404);
    });
});





