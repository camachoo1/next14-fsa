import { z } from "zod";

const accountViewSchema = z.object({
  view: z.enum(["order-history", "edit", "wishlist", "logout"]).optional(),
});

export default accountViewSchema;
export type AccountViewValues = z.infer<typeof accountViewSchema>;
