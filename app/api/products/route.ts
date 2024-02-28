import { db } from "@/lib/db";

export async function getProducts() {
  try {
    const products = await db.product.findMany();
    return products;
  } catch (error) {
    console.error(error);
  }
}
