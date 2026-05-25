"use client";

import Navbar from "@/components/Navbar";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#F7F6EF] text-gray-950">
      <Navbar />

      <section className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="max-w-xl rounded-[2rem] bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl">
            ⚠️
          </div>

          <h1 className="mt-6 text-4xl font-black">
            Something went wrong
          </h1>

          <p className="mt-4 font-semibold text-gray-600">
            Please try again.
          </p>

          <button
            onClick={reset}
            className="mt-8 rounded-full bg-green-700 px-8 py-4 font-black text-white transition hover:bg-green-800"
          >
            Try Again
          </button>
        </div>
      </section>
    </main>
  );
}
