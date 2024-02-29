import Banner from "./_components/Banner";

export default async function Home() {
  return (
    // Main Container for home page
    <main className="relative m-auto h-full w-full">
      {/* Container for Banner Video */}
      <section className="relative mb-24 flex w-full overflow-hidden">
        <Banner />
        {/* Overlay Container for Button */}
        <div className="absolute bottom-0 right-0 flex items-center px-36 py-24">
          {/* Need functionality for redirect */}
          <button className="rounded bg-white px-8 py-4 font-bold uppercase dark:text-black">
            Shop Now
          </button>
        </div>
      </section>

      {/* Container for 'What are you looking for section' */}
      <section className="mx-auto max-w-[1680px] space-y-2">
        <div className="mb-12 flex flex-col items-center px-4">
          <div className="flex flex-wrap">
            <h2 className="text-[2rem] font-black uppercase leading-tight tracking-[.09375em]">
              What are you looking for?
            </h2>
          </div>
        </div>
        <div className="flex items-center justify-evenly">
          <div>Product</div>
          <div>Product</div>
          <div>Product</div>
          <div>Product</div>
        </div>
      </section>
    </main>
  );
}
