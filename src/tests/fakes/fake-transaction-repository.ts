export class FakeTransactionRepository {
    transactions: any[] = [];

    async create(transaction: any) {
        this.transactions.push({
            ...transaction,
            createdAt: transaction.createdAt || new Date(),
        });
    }

    async findByWalletId(walletId: string) {
        return this.transactions.filter(
            (t) =>
            t.fromWallet?.id === walletId ||
            t.toWallet?.id === walletId
        );
    }

    async findByWalletIdAndPeriod(walletId: string, startDate: Date, endDate: Date) {
        return this.transactions.filter(
            (t) => 
            t.fromWallet?.id === walletId &&
            t.createdAt >= startDate &&
            t.createdAt <= endDate
        );
    }

    async findRecentWithdraws(walletId: string, amount: number, startDate: Date) {
        return this.transactions.filter(
            (t) =>
            t.fromWallet?.id === walletId &&
            t.type === "WITHDRAW" &&
            t.amount === amount &&
            t.createdAt >= startDate
        );
    }
}

