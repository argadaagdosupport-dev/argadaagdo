"use client";

import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

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
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    if (offer.quantity <= 0 || !offer.active) {
      setMessage("Offer sold out.");
      loadOffers();
      return;
    }

    const { error: orderError } = await supabase.from("orders").insert({
      user_id: userData.user.id,
      offer_id: offer.id,
      status: "reserved",
      payment_method: "cash",
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

    setMessage("Reserved successfully.");
    loadOffers();
  }

  useEffect(() => {
    loadOffers();
  }, []);

  const filteredOffers = offers.filter((offer) => {
    const text =
      `${offer.title} ${offer.businesses?.name} ${offer.businesses?.address} ${offer.businesses?.business_type}`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-[#F7F6EF]">
      <Navbar />

      <section className="px-6 py-10 md:px-12 md:py-14">
        <div className="rounded-[2rem] bg-green-800 px-6 py-10 text-white md:px-10">
          <p className="text-sm font-bold uppercase tracking-widest text-green-100">
            Tbilisi food rescue
          </p>

          <h1 className="mt-3 max-w-3xl text-4xl font-black md:text-6xl">
            Save good food before it goes to waste.
          </h1>

          <p className="mt-4 max-w-2xl text-green-50">
            Discover food offers from local businesses and reserve pickup-only
            deals in Tbilisi.
          </p>

          <div className="mt-8 flex flex-col gap-3 md:flex-row">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search food, business, address..."
              className="w-full rounded-2xl border-0 bg-white p-4 font-semibold text-gray-900 outline-none md:max-w-xl"
            />

            <button
              onClick={() => setSearch("")}
              className="rounded-2xl bg-white/15 px-6 py-4 font-bold text-white"
            >
              Clear
            </button>
          </div>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl bg-green-100 p-4 font-bold text-green-700">
            {message}
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-3xl font-black">Available Offers</h2>
          <p className="mt-1 font-medium text-gray-700">
            {filteredOffers.length} offer(s) available now
          </p>
        </div>

        {loading && (
          <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
            <p className="font-semibold text-gray-600">Loading offers...</p>
          </div>
        )}

        {!loading && filteredOffers.length === 0 && (
          <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
              🥡
            </div>

            <h3 className="mt-5 text-2xl font-black">No offers found</h3>

            <p className="mt-2 font-medium text-gray-600">
              Try another search or check back later.
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredOffers.map((offer) => {
            const discount =
              offer.old_price && Number(offer.old_price) > Number(offer.price)
                ? Math.round(
                    ((Number(offer.old_price) - Number(offer.price)) /
                      Number(offer.old_price)) *
                      100
                  )
                : null;

            return (
              <div
                key={offer.id}
                className="overflow-hidden rounded-[2rem] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-green-100 to-yellow-100 text-7xl">
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

                  {discount && (
                    <div className="absolute right-4 top-4 rounded-full bg-red-600 px-4 py-2 text-sm font-black text-white shadow-sm">
                      -{discount}%
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-2xl font-black leading-tight text-gray-950">
                        {offer.title}
                      </h4>

                      <p className="mt-2 font-bold text-gray-800">
                        {offer.businesses?.name}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-green-50 px-3 py-2 text-center">
                      <p className="text-xs font-bold text-green-700">LEFT</p>
                      <p className="text-xl font-black text-green-800">
                        {offer.quantity}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 font-medium text-gray-600">
                    📍 {offer.businesses?.address}
                  </p>

                  <p className="mt-2 font-medium text-gray-600">
                    ⏰ Pickup: {offer.pickup_start} - {offer.pickup_end}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-3xl font-black text-green-700">
                        ₾{offer.price}
                      </span>

                      {offer.old_price && (
                        <span className="ml-2 font-bold text-gray-400 line-through">
                          ₾{offer.old_price}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => reserveOffer(offer)}
                      className="rounded-full bg-green-700 px-6 py-3 font-bold text-white transition hover:bg-green-800"
                    >
                      Reserve
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}