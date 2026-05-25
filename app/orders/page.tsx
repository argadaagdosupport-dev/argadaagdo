"use client";

import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        offers(
          id,
          title,
          pickup_start,
          pickup_end,
          price,
          quantity,
          active,
          businesses(name, address, business_type)
        )
      `
      )
      .eq("user_id", userData.user.id)
      .order("id", { ascending: false });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setOrders(data || []);
    setLoading(false);
  }

  async function cancelOrder(order: any) {
    if (order.status !== "reserved") return;

    const { error: orderError } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", order.id);

    if (orderError) {
      setMessage(orderError.message);
      return;
    }

    if (order.offers?.id) {
      const newQuantity = Number(order.offers.quantity || 0) + 1;

      await supabase
        .from("offers")
        .update({
          quantity: newQuantity,
          active: true,
        })
        .eq("id", order.offers.id);
    }

    setMessage("Order cancelled. Quantity restored.");
    loadOrders();
  }

  useEffect(() => {
    loadOrders();

    const channel = supabase
      .channel("orders-live-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => loadOrders()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "offers" },
        () => loadOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const reservedCount = orders.filter((order) => order.status === "reserved").length;
  const completedCount = orders.filter((order) => order.status === "completed").length;
  const cancelledCount = orders.filter((order) => order.status === "cancelled").length;

  return (
    <main className="min-h-screen bg-[#F7F6EF] text-gray-950">
      <Navbar />

      <section className="px-5 py-8 md:px-12 md:py-14">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-10">
          <p className="text-sm font-black uppercase tracking-widest text-green-700">
            My reservations
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-6xl">
            Your pickup orders
          </h1>

          <p className="mt-4 max-w-2xl text-base font-semibold text-gray-700 md:text-lg">
            Show your pickup code at the business during pickup time.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-yellow-100 p-5">
              <p className="text-sm font-black text-yellow-800">Reserved</p>
              <h2 className="mt-2 text-4xl font-black text-yellow-900">
                {reservedCount}
              </h2>
            </div>

            <div className="rounded-3xl bg-green-100 p-5">
              <p className="text-sm font-black text-green-800">Completed</p>
              <h2 className="mt-2 text-4xl font-black text-green-900">
                {completedCount}
              </h2>
            </div>

            <div className="rounded-3xl bg-red-100 p-5">
              <p className="text-sm font-black text-red-800">Cancelled</p>
              <h2 className="mt-2 text-4xl font-black text-red-900">
                {cancelledCount}
              </h2>
            </div>
          </div>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl bg-green-100 p-4 font-bold text-green-700">
            {message}
          </div>
        )}

        {loading && (
          <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
            <p className="font-semibold text-gray-600">Loading orders...</p>
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="mt-8 rounded-[2rem] bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
              🥡
            </div>

            <h2 className="mt-5 text-3xl font-black">No orders yet</h2>

            <p className="mt-3 font-medium text-gray-600">
              Reserve your first food offer and it will appear here.
            </p>

            <a
              href="/offers"
              className="mt-6 inline-block rounded-full bg-green-700 px-8 py-4 font-black text-white"
            >
              Browse Offers
            </a>
          </div>
        )}

        <div className="mt-8 grid gap-5">
          {orders.map((order) => {
            const statusClass =
              order.status === "completed"
                ? "bg-green-100 text-green-700"
                : order.status === "cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700";

            return (
              <div
                key={order.id}
                className="rounded-[2rem] bg-white p-5 shadow-sm md:p-8"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-4 py-2 text-sm font-black ${statusClass}`}
                      >
                        {order.status}
                      </span>

                      <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-black text-green-700">
                        {order.offers?.businesses?.business_type || "Food"}
                      </span>
                    </div>

                    <h2 className="mt-4 text-3xl font-black">
                      {order.offers?.title || "Offer deleted"}
                    </h2>

                    <p className="mt-2 text-lg font-bold text-gray-800">
                      {order.offers?.businesses?.name || "Business unavailable"}
                    </p>

                    <div className="mt-4 grid gap-2 text-gray-700">
                      <p className="font-medium">
                        📍 {order.offers?.businesses?.address || "Address unavailable"}
                      </p>

                      <p className="font-medium">
                        ⏰ Pickup: {order.offers?.pickup_start} -{" "}
                        {order.offers?.pickup_end}
                      </p>

                      <p className="font-black text-green-700">
                        Price: ₾{order.offers?.price}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[2rem] bg-[#F7F6EF] p-5 text-center lg:min-w-[220px]">
                    <p className="text-sm font-black uppercase tracking-widest text-gray-500">
                      Pickup Code
                    </p>

                    <div className="mt-3 rounded-3xl bg-white px-6 py-5 shadow-sm">
                      <p className="text-4xl font-black tracking-widest text-green-700">
                        {order.pickup_code || "------"}
                      </p>
                    </div>

                    <p className="mt-3 text-sm font-bold text-gray-600">
                      Show this code at pickup.
                    </p>

                    {order.status === "reserved" && (
                      <button
                        onClick={() => cancelOrder(order)}
                        className="mt-5 w-full rounded-full bg-red-600 px-6 py-3 font-black text-white transition hover:bg-red-700"
                      >
                        Cancel Order
                      </button>
                    )}
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
