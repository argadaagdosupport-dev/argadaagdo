import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F7F6EF] text-gray-950">
      <Navbar />

      <section className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="max-w-xl rounded-[2rem] bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
            🥡
          </div>

          <h1 className="mt-6 text-5xl font-black">
            Page not found
          </h1>

          <p className="mt-4 font-semibold text-gray-600">
            This page does not exist or the link is incorrect.
          </p>

          <Link
            href="/offers"
            className="mt-8 inline-block rounded-full bg-green-700 px-8 py-4 font-black text-white transition hover:bg-green-800"
          >
            Browse Offers
          </Link>
        </div>
      </section>
    </main>
  );
}
