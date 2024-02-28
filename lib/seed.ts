import { db } from "@/lib/db";
import { products } from "@/lib/products";
import { Category, Gender, Size } from "@prisma/client";

async function main() {
  for (const product of products) {
    const { name, images, category, gender, price, sizes, description } =
      product;

    await db.product.create({
      data: {
        name,
        images: { set: images },
        category: category as Category,
        gender: gender as Gender,
        price,
        sizes: { set: sizes as Size[] },
        description,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma?.$disconnect();
  });
