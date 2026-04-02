import { z } from "zod";

export const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(10, "You can put just 10 letters"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  img: z.string().url("Image URL is required"),
});

export type UserFormValues = z.infer<typeof userSchema>;
