import { z } from 'zod';

// --------------------
// CPF validation
// --------------------

function isValidCPF(cpf: string): boolean {
  if (!/^\d{11}$/.test(cpf)) return false;

  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  let remainder;

  for (let i = 0; i < 9; i++) {
    sum += Number(cpf[i]) * (10 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== Number(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number(cpf[i]) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== Number(cpf[10])) return false;

  return true;
}

// --------------------
// Reusable CPF schema
// --------------------

const cpfSchema = z
  .string()
  .transform((val) => val.replace(/\D/g, "")) 
  .refine((val) => val.length === 11, {
    message: "CPF must have exactly 11 digits",
  })
  .refine((val) => isValidCPF(val), {
    message: "Invalid CPF",
  });

// --------------------
// Create wallet
// --------------------

export const createWalletSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .trim(),

  cpf: cpfSchema,

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
});

// --------------------
// Wallet ID param
// --------------------

export const walletIdParamSchema = z.object({
  id: z.string().uuid("Invalid wallet ID format"),
});