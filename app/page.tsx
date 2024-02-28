import { lucia, validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getProducts } from "./api/products/route";
import Image from "next/image";
import { Suspense } from "react";
import { ProductCard } from "./_components/productcard";

export default async function Home() {
  const { user } = await validateRequest();
  const products = await getProducts();

  // if (!user) {
  //   return redirect('/login');
  // }

  return (
    <main className="m-auto my-10 max-w-5xl space-y-10 px-3">
      {user ? (
        <div>
          <p>{user?.username}</p>
          <p>{user?.githubId}</p>
        </div>
      ) : (
        "Hello Alo"
      )}
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex columns-2 items-center dark:text-white">
          {products?.map((product) => (
            <>
              <div className="flex flex-col gap-y-1">
                <ProductCard imgs={product.images} alt={product.name} />
                <h1 className="text-lg font-semibold">{product.name}</h1>
                <p className="text-sm">{product.category}</p>
                <p className="text-muted-foreground">{product.gender}</p>
                <p className="text-sm">Sizes:</p>
                <div className="flex">
                  {product.sizes.map((size) => (
                    <button className="mx-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-black bg-muted hover:bg-muted-foreground/30 active:bg-muted-foreground/30">
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
            </>
          ))}
        </div>
      </Suspense>
    </main>
  );
}
