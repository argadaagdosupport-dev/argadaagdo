"use client";

import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function BusinessDashboardPage() {
  const [loading, setLoading] = useState(true);

  const [businesses, setBusinesses] = useState<any[]>([]);
  const [approvedBusinesses, setApprovedBusinesses] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const [businessId, setBusinessId] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [pickupStart, setPickupStart] = useState("");
  const [pickupEnd, setPickupEnd] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pickupCode, setPickupCode] = useState("");
  const [message, setMessage] = useState("");

  async function loadDashboard() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    if (!profile || (profile.role !== "business" && profile.role !== "admin")) {
      window.location.href = "/offers";
      return;
    }

    const { data: myBusinesses } = await supabase
      .from("businesses")
      .select("*")
      .eq("owner_id", userData.user.id)
      .order("id", { ascending: false });

    const allBusinesses = myBusinesses || [];
    const approved = allBusinesses.filter((business) => business.approved);

    setBusinesses(allBusinesses);
    setApprovedBusinesses(approved);

    if (approved.length > 0 && !businessId) {
      setBusinessId(String(approved[0].id));
    }

    const businessIds = allBusinesses.map((business) => business.id);

    if (businessIds.length === 0) {
      setOffers([]);
      setOrders([]);
      setLoading(false);
      return;
    }

    const { data: myOffers } = await supabase
      .from("offers")
      .select("*, businesses(name)")
      .in("business_id", businessIds)
      .order("id", { ascending: false });

    setOffers(myOffers || []);

    const offerIds = (myOffers || []).map((offer) => offer.id);

    if (offerIds.length > 0) {
      const { data: myOrders } = await supabase
        .from("orders")
        .select(`
          *,
          offers(title, price),
          profiles(email)
        `)
        .in("offer_id", offerIds)
        .order("id", { ascending: false });

      setOrders(myOrders || []);
    } else {
      setOrders([]);
    }

    setLoading(false);
  }

  async function uploadImage() {
    if (!imageFile) return "";

    const fileName = `${Date.now()}-${imageFile.name}`;

    const { error } = await supabase.storage
      .from("offer-images")
      .upload(fileName, imageFile);

    if (error) {
      setMessage(error.message);
      return "";
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("offer-images").getPublicUrl(fileName);

    return publicUrl;
  }

  async function createOffer() {
    setMessage("");

    if (!businessId) {
      setMessage("No approved business found.");
      return;
    }

    if (!title.trim()) {
      setMessage("Offer title required.");
      return;
    }

    if (Number(price) <= 0) {
      setMessage("Price must be greater than 0.");
      return;
    }

    if (Number(quantity) <= 0) {
      setMessage("Quantity must be greater than 0.");
      return;
    }

    if (!pickupStart || !pickupEnd) {
      setMessage("Pickup time required.");
      return;
    }

    setMessage("Publishing offer...");

    const imageUrl = await uploadImage();

    const { error } = await supabase.from("offers").insert({
      business_id: Number(businessId),
      title,
      price: Number(price),
      old_price: oldPrice ? Number(oldPrice) : null,
      quantity: Number(quantity),
      pickup_start: pickupStart,
      pickup_end: pickupEnd,
      category: "Food",
      active: true,
      image_url: imageUrl,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setTitle("");
    setPrice("");
    setOldPrice("");
    setQuantity("1");
    setPickupStart("");
    setPickupEnd("");
    setImageFile(null);

    setMessage("Offer published.");
    loadDashboard();
  }

  async function deleteOffer(offerId: number) {
    const { error } = await supabase.from("offers").delete().eq("id", offerId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Offer deleted.");
    loadDashboard();
  }

  async function completeOrder(orderId: number) {
    const { error } = await supabase
      .from("orders")
      .update({ status: "completed" })
      .eq("id", orderId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Order completed.");
    loadDashboard();
  }

  async function verifyPickupCode() {
    setMessage("");

    if (!pickupCode.trim()) {
      setMessage("Enter pickup code.");
      return;
    }

    const order = orders.find(
      (item) =>
        item.pickup_code === pickupCode.trim() &&
        item.status === "reserved"
    );

    if (!order) {
      setMessage("Invalid pickup code or order already completed.");
      return;
    }

    await completeOrder(order.id);
    setPickupCode("");
  }

useEffect(() => {
  loadDashboard();

  const channel = supabase
    .channel("business-dashboard-live-updates")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "orders" },
      () => loadDashboard()
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "offers" },
      () => loadDashboard()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  const activeOffers = offers.filter((offer) => offer.active);
  const completedOrders = orders.filter((order) => order.status === "completed");
  const reservedOrders = orders.filter((order) => order.status === "reserved");
  const cancelledOrders = orders.filter((order) => order.status === "cancelled");

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F6EF]">
        <Navbar />
        <section className="px-6 py-12 md:px-12">
          <h1 className="text-4xl font-black">Loading dashboard...</h1>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F6EF] text-gray-950">
      <Navbar />

      <section className="px-6 py-10 md:px-12 md:py-14">
        <div className="rounded-[2.5rem] bg-green-800 p-8 text-white shadow-xl md:p-12">
          <p className="text-sm font-black uppercase tracking-widest text-green-100">
            Business control center
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-6xl">
            Manage offers and pickups.
          </h1>

          <p className="mt-4 max-w-2xl text-lg font-semibold text-green-50">
            Publish rescue boxes, track reservations, and verify pickup codes
            when customers arrive.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-3xl bg-white/10 p-5">
              <p className="text-sm font-black text-green-100">Active Offers</p>
              <h2 className="mt-1 text-4xl font-black">{activeOffers.length}</h2>
            </div>

            <div className="rounded-3xl bg-white/10 p-5">
              <p className="text-sm font-black text-green-100">Reserved</p>
              <h2 className="mt-1 text-4xl font-black">{reservedOrders.length}</h2>
            </div>

            <div className="rounded-3xl bg-white/10 p-5">
              <p className="text-sm font-black text-green-100">Completed</p>
              <h2 className="mt-1 text-4xl font-black">{completedOrders.length}</h2>
            </div>

            <div className="rounded-3xl bg-white/10 p-5">
              <p className="text-sm font-black text-green-100">Cancelled</p>
              <h2 className="mt-1 text-4xl font-black">{cancelledOrders.length}</h2>
            </div>
          </div>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl bg-green-100 p-4 font-bold text-green-700">
            {message}
          </div>
        )}

        <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-black">Verify Pickup Code</h2>

          <p className="mt-2 font-semibold text-gray-600">
            Ask customer for the 6-digit pickup code from their Orders page.
          </p>

          <div className="mt-6 flex flex-col gap-4 md:flex-row">
            <input
              value={pickupCode}
              onChange={(e) => setPickupCode(e.target.value)}
              placeholder="Enter pickup code"
              className="rounded-2xl border bg-white p-4 text-xl font-black tracking-widest outline-none md:max-w-sm"
            />

            <button
              onClick={verifyPickupCode}
              className="rounded-full bg-green-700 px-8 py-4 font-black text-white transition hover:bg-green-800"
            >
              Verify Pickup
            </button>
          </div>
        </div>

        {approvedBusinesses.length === 0 && (
          <div className="mt-8 rounded-3xl bg-yellow-100 p-8">
            <h2 className="text-2xl font-black text-yellow-800">
              Waiting for approval
            </h2>
            <p className="mt-3 font-medium text-yellow-700">
              Your business must be approved before publishing offers.
            </p>
          </div>
        )}

        {approvedBusinesses.length > 0 && (
          <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-black">Create Offer</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <select
                value={businessId}
                onChange={(e) => setBusinessId(e.target.value)}
                className="rounded-2xl border p-4 font-semibold"
              >
                {approvedBusinesses.map((business) => (
                  <option key={business.id} value={business.id}>
                    {business.name}
                  </option>
                ))}
              </select>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-2xl border p-4 font-semibold"
                placeholder="Offer title"
              />

              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="rounded-2xl border p-4 font-semibold"
                placeholder="Price"
              />

              <input
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                className="rounded-2xl border p-4 font-semibold"
                placeholder="Old price"
              />

              <input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="rounded-2xl border p-4 font-semibold"
                placeholder="Quantity"
              />

              <input
                value={pickupStart}
                onChange={(e) => setPickupStart(e.target.value)}
                className="rounded-2xl border p-4 font-semibold"
                placeholder="Pickup start"
              />

              <input
                value={pickupEnd}
                onChange={(e) => setPickupEnd(e.target.value)}
                className="rounded-2xl border p-4 font-semibold"
                placeholder="Pickup end"
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="rounded-2xl border bg-white p-4 font-semibold"
              />
            </div>

            <button
              onClick={createOffer}
              className="mt-6 rounded-full bg-green-700 px-8 py-4 font-black text-white transition hover:bg-green-800"
            >
              Publish Offer
            </button>
          </div>
        )}

        <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-black">My Offers</h2>

          <div className="mt-6 grid gap-4">
            {offers.length === 0 && (
              <p className="font-medium text-gray-600">No offers created yet.</p>
            )}

            {offers.map((offer) => (
              <div
                key={offer.id}
                className="flex flex-col gap-4 rounded-2xl border p-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex gap-4">
                  {offer.image_url ? (
                    <img
                      src={offer.image_url}
                      alt={offer.title}
                      className="h-24 w-24 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-green-100 text-4xl">
                      🥡
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-black">{offer.title}</h3>
                    <p className="font-medium text-gray-700">
                      ₾{offer.price} · Quantity: {offer.quantity}
                    </p>
                    <p className="text-gray-600">
                      Pickup: {offer.pickup_start} - {offer.pickup_end}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => deleteOffer(offer.id)}
                  className="rounded-full bg-red-600 px-5 py-3 font-bold text-white"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-black">Reservations</h2>

          <div className="mt-6 grid gap-4">
            {orders.length === 0 && (
              <p className="font-medium text-gray-600">No reservations yet.</p>
            )}

            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-5 rounded-2xl border p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <h3 className="text-2xl font-black">{order.offers?.title}</h3>

                  <p className="mt-2 font-semibold text-gray-700">
                    Customer: {order.profiles?.email}
                  </p>

                  <p className="mt-1 font-black text-green-700">
                    ₾{order.offers?.price}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-black ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>

                    <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-black text-gray-700">
                      Code: {order.pickup_code || "------"}
                    </span>
                  </div>
                </div>

                {order.status === "reserved" && (
                  <button
                    onClick={() => completeOrder(order.id)}
                    className="rounded-full bg-green-700 px-5 py-3 font-black text-white transition hover:bg-green-800"
                  >
                    Complete Manually
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
