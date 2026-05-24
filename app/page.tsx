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
    <main className="min-h-screen bg-[#F7F6EF] text-gray-950">
      <Navbar />

      <section className="relative overflow-hidden px-6 py-12 md:px-12 md:py-20">
        <div className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-green-200/50 blur-3xl" />
        <div className="absolute bottom-[-140px] right-[-120px] h-96 w-96 rounded-full bg-yellow-200/60 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="inline-flex rounded-full border border-green-200 bg-white px-5 py-2 text-sm font-black text-green-800 shadow-sm">
                Tbilisi’s food rescue marketplace
              </div>

              <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
                Save good food.
                <span className="block text-green-700">Pay less.</span>
                Waste less.
              </h1>

              <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-gray-700 md:text-xl">
                Discover discounted food boxes from local cafes, bakeries,
                restaurants and supermarkets. Reserve online and pick up in
                Tbilisi.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/offers"
                  className="rounded-full bg-green-700 px-8 py-4 text-center font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-green-800"
                >
                  Explore Offers
                </Link>

                <Link
                  href="/business/register"
                  className="rounded-full border border-gray-300 bg-white px-8 py-4 text-center font-black text-gray-950 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50"
                >
                  Join as Business
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <p className="text-3xl font-black text-green-700">
                    {offers.length}
                  </p>
                  <p className="mt-1 font-bold text-gray-600">
                    live offers
                  </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <p className="text-3xl font-black text-green-700">
                    100%
                  </p>
                  <p className="mt-1 font-bold text-gray-600">
                    pickup only
                  </p>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <p className="text-3xl font-black text-green-700">
                    ₾
                  </p>
                  <p className="mt-1 font-bold text-gray-600">
                    cash on pickup
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2.5rem] bg-green-800 p-5 shadow-xl">
                <div className="rounded-[2rem] bg-white p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-widest text-green-700">
                        Featured offer
                      </p>
                      <h2 className="mt-2 text-3xl font-black">
                        Surprise food box
                      </h2>
                      <p className="mt-2 font-semibold text-gray-600">
                        Pickup today · Tbilisi
                      </p>
                    </div>
                    <div className="text-6xl">🥡</div>
                  </div>

                  <div className="mt-6 grid gap-4">
                    {(offers.length > 0 ? offers : []).slice(0, 2).map((offer) => (
                      <div
                        key={offer.id}
                        className="flex items-center gap-4 rounded-3xl bg-[#F7F6EF] p-4"
                      >
                        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-green-100 text-4xl">
                          {offer.image_url ? (
                            <img
                              src={offer.image_url}
                              alt={offer.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            "🥡"
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-black">{offer.title}</h3>
                          <p className="text-sm font-semibold text-gray-600">
                            {offer.businesses?.name}
                          </p>
                          <p className="text-sm font-semibold text-gray-500">
                            {offer.pickup_start} - {offer.pickup_end}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-black text-green-700">
                            ₾{offer.price}
                          </p>
                          <p className="text-xs font-bold text-gray-500">
                            {offer.quantity} left
                          </p>
                        </div>
                      </div>
                    ))}

                    {offers.length === 0 && (
                      <>
                        <div className="flex items-center gap-4 rounded-3xl bg-[#F7F6EF] p-4">
                          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-green-100 text-4xl">
                            🥐
                          </div>
                          <div className="flex-1">
                            <h3 className="font-black">Bakery box</h3>
                            <p className="text-sm font-semibold text-gray-600">
                              Waiting for live offers
                            </p>
                          </div>
                          <p className="text-xl font-black text-green-700">
                            ₾6
                          </p>
                        </div>

                        <div className="flex items-center gap-4 rounded-3xl bg-[#F7F6EF] p-4">
                          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-yellow-100 text-4xl">
                            🥗
                          </div>
                          <div className="flex-1">
                            <h3 className="font-black">Lunch box</h3>
                            <p className="text-sm font-semibold text-gray-600">
                              Create offers in dashboard
                            </p>
                          </div>
                          <p className="text-xl font-black text-green-700">
                            ₾8
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-4 rounded-3xl bg-white p-5 shadow-xl md:-left-8">
                <p className="text-sm font-black text-gray-500">
                  Food saved today
                </p>
                <p className="mt-1 text-3xl font-black text-green-700">
                  {offers.reduce(
                    (total, offer) => total + Number(offer.quantity || 0),
                    0
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-green-700">
                Fresh right now
              </p>
              <h3 className="mt-2 text-4xl font-black text-gray-950">
                Today’s offers
              </h3>
              <p className="mt-2 text-lg font-semibold text-gray-700">
                Real offers from approved businesses in Tbilisi.
              </p>
            </div>

            <Link
              href="/offers"
              className="w-fit rounded-full bg-white px-6 py-3 font-black text-green-700 shadow-sm transition hover:bg-green-50"
            >
              View all offers
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="overflow-hidden rounded-[2rem] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
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
                      <h4 className="text-2xl font-black">
                        {offer.title}
                      </h4>
                      <p className="mt-2 font-bold text-gray-700">
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

                  <p className="mt-4 font-semibold text-gray-600">
                    📍 {offer.businesses?.address}
                  </p>

                  <p className="mt-2 font-semibold text-gray-600">
                    ⏰ {offer.pickup_start} - {offer.pickup_end}
                  </p>

                  <div className="mt-7 flex items-center justify-between">
                    <div>
                      <span className="text-4xl font-black text-green-700">
                        ₾{offer.price}
                      </span>

                      {offer.old_price && (
                        <span className="ml-3 font-bold text-gray-400 line-through">
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

            {offers.length === 0 && (
              <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm md:col-span-3">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
                  🥡
                </div>
                <h3 className="mt-5 text-3xl font-black">
                  No live offers yet
                </h3>
                <p className="mt-3 font-semibold text-gray-600">
                  Create your first offer from the business dashboard.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {[
            {
              icon: "📍",
              title: "Find nearby food",
              text: "Browse live food boxes from approved businesses around Tbilisi.",
            },
            {
              icon: "💸",
              title: "Reserve for less",
              text: "Save money while helping reduce daily food waste.",
            },
            {
              icon: "🥡",
              title: "Pick it up",
              text: "Reserve online and collect your order during pickup hours.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[2rem] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-4xl">
                {item.icon}
              </div>
              <h4 className="mt-6 text-2xl font-black">{item.title}</h4>
              <p className="mt-3 font-semibold leading-7 text-gray-700">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
