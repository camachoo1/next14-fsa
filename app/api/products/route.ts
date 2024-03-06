import { db } from "@/lib/db/db";

export async function getProducts() {
  try {
    const products = await db.product.findMany();
    return products;
  } catch (error) {
    console.error(error);
  }
}
