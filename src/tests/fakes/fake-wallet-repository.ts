export class FakeWalletRepository {
    wallets: any[] = [];

    async create(wallet: any) {
        wallet.id = wallet.id ?? crypto.randomUUID(); 
        this.wallets.push(wallet);
        return wallet;
    }

    async findById(id: string) {
        return this.wallets.find(w => w.id === id) || null;
    }

    async save(wallet: any) {
        const index = this.wallets.findIndex(w => w.id === wallet.id);

        if (index >= 0) {
            this.wallets[index] = wallet;
        }

        else {
            this.wallets.push(wallet);
        }
    }
}