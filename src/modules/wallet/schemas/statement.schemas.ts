import { z } from "zod";

export const statementQuerySchema = z.object({
  period: z.coerce
    .number()
    .refine((value) => [7, 30, 90].includes(value), {
      message: "Period must be 7, 30 or 90 days",
    }),
});