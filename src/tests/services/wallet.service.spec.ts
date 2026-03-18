import * as bcrypt from "bcrypt";
import { WalletService } from "../../modules/wallet/services/wallet.service";
import { FakeWalletRepository } from "../fakes/fake-wallet-repository";

describe("WalletService", () => {
    let walletService: WalletService;
    let fakeWalletRepo: FakeWalletRepository;

    beforeEach(() => {
        fakeWalletRepo = new FakeWalletRepository();
        walletService = new WalletService(fakeWalletRepo as any);
    });

    it("should create a wallet with zero balance", async () => {
        const wallet = await walletService.createWallet("Giselle", "12345678900", "123456");
        expect(wallet).toBeDefined();
        expect(wallet.balance).toBe(0);
    });

    it("should store the wallet in the repository", async () => {
        const wallet = await walletService.createWallet("Giselle", "12345678900", "123456");
        const storedWallet = await fakeWalletRepo.findById(wallet.id);

        expect(storedWallet).not.toBeNull();
        expect(storedWallet?.name).toBe("Giselle");

    });

    it("should return wallet by id", async () => {
        const wallet = await walletService.createWallet(
        "Giselle",
        "12345678900",
        "123456"
        );

        const result = await walletService.getWalletById(wallet.id);

        expect(result).not.toBeNull();
        expect(result?.id).toBe(wallet.id);
    });

    it("should throw if wallet not found", async () => {
        await expect(walletService.getWalletById("non-existent-id")).rejects.toThrow("Wallet not found");
    });
});
