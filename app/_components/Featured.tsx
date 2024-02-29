import { Suspense } from 'react';
import { getProducts } from '../api/products/route';
import { ProductCard } from './productcard';

export default async function Featured() {
  const products = await getProducts()
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex columns-2 items-center dark:text-white">
        {products?.map((product) => (
          <section key={product.id}>
            <div className="flex flex-col gap-y-1">
              <ProductCard imgs={product.images} alt={product.name} />
              <h1 className="text-lg font-semibold">{product.name}</h1>
              <p className="text-sm">{product.category}</p>
              <p className="text-muted-foreground">{product.gender}</p>
              <p className="text-sm">Sizes:</p>
              <div className="flex">
                {product.sizes.map((size) => (
                  <button
                    key={product.id}
                    className="mx-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-black bg-muted hover:bg-muted-foreground/30 active:bg-muted-foreground/30"
                  >
                    {size}
                  </button>
                ))}
              </div>
              <br />
              <div className="text-sm">{product.description}</div>
              <div className="">${product.price}</div>
              <br />
              <button className="h-10 max-w-md rounded-lg bg-black font-semibold text-white hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70">
                Add to Cart
              </button>
            </div>
          </section>
        ))}
      </div>
    </Suspense>
  );
}