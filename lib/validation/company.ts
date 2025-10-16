import { z } from "zod";

export const companySchema = z.object({
  sicCode: z.string().trim().optional(),
  name: z.string().trim().min(2, "Company name is required"),
  address: z.string().trim().optional(),
  postCode: z.string().trim().optional(),
  telephone: z.string().trim().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  adminPerson: z.string().trim().optional(),
  employees: z.coerce.number().int().min(0, "Must be 0 or more").optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  services: z.array(z.string().trim()).default([]),
});

export type CompanyPayload = z.infer<typeof companySchema>;
