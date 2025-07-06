import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email("Please provide a valid email."),

  password: z
    .string()
    .min(1, { message: "Password is required." })
    .superRefine((val, ctx) => {
      if (val.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 6,
          type: "string",
          inclusive: true,
          message: "Password must be at least 6 characters.",
        });
      }

      if (!/[a-z]/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must contain at least one lowercase letter.",
        });
      }

      if (!/[A-Z]/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must contain at least one uppercase letter.",
        });
      }

      if (!/\d/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must contain at least one number.",
        });
      }

      if (!/[^A-Za-z0-9]/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must contain at least one special character.",
        });
      }
    }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
