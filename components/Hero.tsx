import Link from "next/link";

export default function Hero() {
  return (
    <section className="px-6 py-16 text-center md:px-12 md:py-24">
      <p className="mb-5 inline-block rounded-full bg-green-100 px-5 py-2 font-semibold text-green-800">
        Save food. Save money. Help Tbilisi.
      </p>

      <h2 className="mx-auto max-w-5xl text-5xl font-black leading-tight md:text-7xl">
        Rescue delicious food before it goes to waste
      </h2>

      <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 md:text-xl">
        Discover discounted food from bakeries, cafes, restaurants and supermarkets around Tbilisi.
      </p>

      <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
        <Link href="/offers" className="rounded-full bg-green-700 px-8 py-4 text-lg font-bold text-white">
          Explore Offers
        </Link>

        <Link href="/business/register" className="rounded-full border border-gray-300 bg-white px-8 py-4 text-lg font-bold">
          Register Business
        </Link>
      </div>
    </section>
  );
}