import { AppDataSource } from "../modules/wallet/database/data.source";

beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
    await AppDataSource.dropDatabase();
    await AppDataSource.synchronize();
});

afterAll(async () => {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
});

