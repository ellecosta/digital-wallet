import { z } from 'zod';

// Create wallet

export const createWalletSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    cpf: z.string().min(11, 'CPF must be at least 11 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Wallet ID param

export const walletIdParamSchema = z.object({
    id: z.string().uuid('Invalid wallet ID format'),
});

