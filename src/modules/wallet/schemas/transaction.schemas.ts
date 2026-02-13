import { z } from 'zod';

// Deposit / Withdraw
export const transactionSchema = z.object({
    amount: z.number().positive('Amount must be a positive number'),
});

// Transfer
export const transferSchema = z.object({
    toWalletId: z.string().uuid('Invalid wallet ID format'),
    amount: z.number().positive('Amount must be a positive number'),
});