export class FakeTransactionRepository {
    transactions: any[] = [];

    async create(transaction: any) {
        this.transactions.push(transaction);
    }

    async findByWalletId(walletId: string) {
        return this.transactions.filter(
            t => t.fromWallet?.id === walletId
        );
    }
}
