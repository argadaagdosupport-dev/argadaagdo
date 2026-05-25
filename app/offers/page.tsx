"use client";

import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { useEffect, useMemo, useState } from "react";

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  function generatePickupCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async function loadOffers() {
    setLoading(true);

    const { data } = await supabase
      .from("offers")
      .select("*, businesses(name, address, business_type)")
      .eq("active", true)
      .gt("quantity", 0)
      .order("id", { ascending: false });

    setOffers(data || []);
    setLoading(false);
  }

  async function reserveOffer(offer: any) {
    setMessage("");

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    if (offer.quantity <= 0 || !offer.active) {
      setMessage("This offer is sold out.");
      loadOffers();
      return;
    }

    const pickupCode = generatePickupCode();

    const { error: orderError } = await supabase.from("orders").insert({
      user_id: userData.user.id,
      offer_id: offer.id,
      status: "reserved",
      payment_method: "cash",
      pickup_code: pickupCode,
    });

    if (orderError) {
      setMessage(orderError.message);
      return;
    }

    const newQuantity = Number(offer.quantity) - 1;

    const { error: updateError } = await supabase
      .from("offers")
      .update({
        quantity: newQuantity,
        active: newQuantity > 0,
      })
      .eq("id", offer.id);

    if (updateError) {
      setMessage(updateError.message);
      return;
    }

    setMessage("Reserved successfully. Your pickup code is in Orders.");
    loadOffers();
  }

  useEffect(() => {
    loadOffers();
  }, []);

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const text =
        `${offer.title} ${offer.businesses?.name} ${offer.businesses?.address} ${offer.businesses?.business_type}`.toLowerCase();

      return text.includes(search.toLowerCase());
    });
  }, [offers, search]);

  const totalAvailable = offers.reduce(
    (total, offer) => total + Number(offer.quantity || 0),
    0
  );

  return (
    <main className="min-h-screen bg-[#F7F6EF] text-gray-950">
      <Navbar />

      <section className="relative overflow-hidden px-6 py-10 md:px-12 md:py-14">
        <div className="absolute left-[-160px] top-[-140px] h-80 w-80 rounded-full bg-green-200/50 blur-3xl" />
        <div className="absolute bottom-[-160px] right-[-130px] h-96 w-96 rounded-full bg-yellow-200/60 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="rounded-[2.5rem] bg-green-800 p-8 text-white shadow-xl md:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-green-100">
                  Live offers in Tbilisi
                </p>

                <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
                  Rescue food boxes near you.
                </h1>

                <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-green-50">
                  Search live food rescue deals from approved local businesses.
                  Reserve online, pick up in store, and help reduce waste.
                </p>

                <div className="mt-8 flex flex-col gap-3 md:flex-row">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search food, business, address..."
                    className="w-full rounded-2xl border-0 bg-white p-4 font-bold text-gray-950 outline-none md:max-w-xl"
                  />

                  <button
                    onClick={() => setSearch("")}
                    className="rounded-2xl bg-white/15 px-6 py-4 font-black text-white transition hover:bg-white/20"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-3xl bg-white/10 p-5">
                  <p className="text-sm font-black text-green-100">Offers</p>
                  <h2 className="mt-1 text-4xl font-black">{offers.length}</h2>
                </div>

                <div className="rounded-3xl bg-white/10 p-5">
                  <p className="text-sm font-black text-green-100">
                    Food boxes left
                  </p>
                  <h2 className="mt-1 text-4xl font-black">{totalAvailable}</h2>
                </div>

                <div className="rounded-3xl bg-white/10 p-5">
                  <p className="text-sm font-black text-green-100">Pickup</p>
                  <h2 className="mt-1 text-4xl font-black">100%</h2>
                </div>
              </div>
            </div>
          </div>

          {message && (
            <div className="mt-6 rounded-2xl bg-green-100 p-4 font-bold text-green-700">
              {message}
            </div>
          )}

          <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-green-700">
                Available now
              </p>

              <h2 className="mt-2 text-4xl font-black">Food rescue offers</h2>

              <p className="mt-2 font-semibold text-gray-700">
                {filteredOffers.length} offer(s) match your search.
              </p>
            </div>

            <div className="rounded-full bg-white px-5 py-3 font-black text-green-700 shadow-sm">
              Cash on pickup
            </div>
          </div>

          {loading && (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-[430px] animate-pulse rounded-[2rem] bg-white shadow-sm"
                />
              ))}
            </div>
          )}

          {!loading && filteredOffers.length === 0 && (
            <div className="mt-8 rounded-[2rem] bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
                🥡
              </div>

              <h3 className="mt-5 text-3xl font-black">No offers found</h3>

              <p className="mt-3 font-semibold text-gray-600">
                Try another search or check back later for new rescue boxes.
              </p>
            </div>
          )}

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredOffers.map((offer) => {
              const discount =
                offer.old_price &&
                Number(offer.old_price) > Number(offer.price)
                  ? Math.round(
                      ((Number(offer.old_price) - Number(offer.price)) /
                        Number(offer.old_price)) *
                        100
                    )
                  : null;

              return (
                <div
                  key={offer.id}
                  className="group overflow-hidden rounded-[2rem] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative flex h-60 items-center justify-center overflow-hidden bg-gradient-to-br from-green-100 to-yellow-100 text-8xl">
                    {offer.image_url ? (
                      <img
                        src={offer.image_url}
                        alt={offer.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      "🥡"
                    )}

                    <div className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-sm font-black text-green-700 shadow-sm">
                      {offer.businesses?.business_type || "Food"}
                    </div>

                    {discount && (
                      <div className="absolute right-4 top-4 rounded-full bg-red-600 px-4 py-2 text-sm font-black text-white shadow-sm">
                        -{discount}%
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 rounded-full bg-black/55 px-4 py-2 text-sm font-black text-white backdrop-blur">
                      Pickup {offer.pickup_start} - {offer.pickup_end}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-2xl font-black leading-tight">
                          {offer.title}
                        </h4>

                        <p className="mt-2 text-lg font-bold text-gray-800">
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

                    <p className="mt-4 font-semibold leading-6 text-gray-600">
                      📍 {offer.businesses?.address || "Tbilisi"}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-800">
                        Pickup only
                      </span>

                      <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-800">
                        Cash payment
                      </span>
                    </div>

                    <div className="mt-7 flex items-center justify-between gap-4">
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

                      <button
                        onClick={() => reserveOffer(offer)}
                        className="rounded-full bg-green-700 px-6 py-3 font-black text-white transition hover:bg-green-800"
                      >
                        Reserve
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
