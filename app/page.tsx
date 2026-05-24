"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [offers, setOffers] = useState<any[]>([]);

  async function loadOffers() {
    const { data } = await supabase
      .from("offers")
      .select("*, businesses(name, address, business_type)")
      .eq("active", true)
      .gt("quantity", 0)
      .order("id", { ascending: false })
      .limit(3);

    setOffers(data || []);
  }

  useEffect(() => {
    loadOffers();
  }, []);

  return (
    <main className="min-h-screen bg-[#F7F6EF] text-gray-900">
      <Navbar />

      <section className="px-6 py-14 md:px-12 md:py-20">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] bg-white p-8 shadow-sm md:p-14">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <span className="inline-flex rounded-full bg-green-100 px-5 py-2 text-sm font-black text-green-800">
                Save food. Save money. Help Tbilisi.
              </span>

              <h1 className="mt-6 text-5xl font-black leading-tight text-gray-950 md:text-7xl">
                Rescue delicious food before it goes to waste
              </h1>

              <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-gray-700">
                Discover discounted food from bakeries, cafes, restaurants and
                supermarkets around Tbilisi.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/offers"
                  className="rounded-full bg-green-700 px-8 py-4 text-center font-black text-white transition hover:bg-green-800"
                >
                  Explore Offers
                </Link>

                <Link
                  href="/business/register"
                  className="rounded-full border border-gray-300 bg-white px-8 py-4 text-center font-black text-gray-900 transition hover:bg-gray-50"
                >
                  Register Business
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] bg-green-50 p-6">
              <div className="grid gap-4">
                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-green-700">
                        Real marketplace
                      </p>

                      <h3 className="mt-2 text-2xl font-black">
                        Live food offers
                      </h3>

                      <p className="mt-1 font-semibold text-gray-600">
                        Updated from Supabase
                      </p>
                    </div>

                    <div className="text-5xl">🥡</div>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-black text-green-700">
                        {offers.length}
                      </span>

                      <span className="ml-2 font-bold text-gray-400">
                        active now
                      </span>
                    </div>

                    <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-800">
                      Tbilisi
                    </span>
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-green-700">
                        Pickup only
                      </p>

                      <h3 className="mt-2 text-2xl font-black">
                        No delivery needed
                      </h3>

                      <p className="mt-1 font-semibold text-gray-600">
                        Reserve online and collect in-store
                      </p>
                    </div>

                    <div className="text-5xl">📍</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-4xl font-black text-gray-950">
              Today’s offers
            </h3>

            <p className="mt-2 text-lg font-medium text-gray-700">
              Real offers from businesses in Tbilisi
            </p>
          </div>

          <Link
            href="/offers"
            className="w-fit rounded-full bg-white px-5 py-3 font-black text-green-700 shadow-sm"
          >
            View all offers
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="overflow-hidden rounded-[2rem] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-green-100 to-yellow-100 text-8xl">
                {offer.image_url ? (
                  <img
                    src={offer.image_url}
                    alt={offer.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "🥡"
                )}

                <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-black text-green-700 shadow-sm">
                  {offer.businesses?.business_type || "Food"}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-3xl font-black">
                      {offer.title}
                    </h4>

                    <p className="mt-2 text-lg font-bold text-gray-700">
                      {offer.businesses?.name}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-green-50 px-4 py-3 text-center">
                    <p className="text-xs font-black text-green-700">
                      LEFT
                    </p>

                    <p className="text-2xl font-black text-green-800">
                      {offer.quantity}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-gray-500">
                  📍 {offer.businesses?.address}
                </p>

                <p className="mt-3 text-gray-500">
                  ⏰ {offer.pickup_start} - {offer.pickup_end}
                </p>

                <div className="mt-8 flex items-center justify-between">
                  <div>
                    <span className="text-4xl font-black text-green-700">
                      ₾{offer.price}
                    </span>

                    {offer.old_price && (
                      <span className="ml-3 text-lg font-bold text-gray-400 line-through">
                        ₾{offer.old_price}
                      </span>
                    )}
                  </div>

                  <Link
                    href="/offers"
                    className="rounded-full bg-green-700 px-6 py-3 font-black text-white transition hover:bg-green-800"
                  >
                    Reserve
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 px-6 py-16 md:grid-cols-3 md:px-12">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-3xl">
            📍
          </div>

          <h4 className="mt-5 text-2xl font-black">
            Find nearby food
          </h4>

          <p className="mt-3 font-medium leading-7 text-gray-700">
            Browse real food offers from approved local businesses.
          </p>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-3xl">
            💸
          </div>

          <h4 className="mt-5 text-2xl font-black">
            Reserve for less
          </h4>

          <p className="mt-3 font-medium leading-7 text-gray-700">
            Save money while helping reduce food waste in Tbilisi.
          </p>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-3xl">
            🥡
          </div>

          <h4 className="mt-5 text-2xl font-black">
            Pick it up
          </h4>

          <p className="mt-3 font-medium leading-7 text-gray-700">
            Reserve online and collect your order during pickup hours.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}