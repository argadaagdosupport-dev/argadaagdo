"use client";

import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function checkAdminAndLoadData() {
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

    if (!profile || profile.role !== "admin") {
      window.location.href = "/offers";
      return;
    }

    const { data: businessData } = await supabase
      .from("businesses")
      .select("*")
      .order("id", { ascending: false });

    const { data: offerData } = await supabase
      .from("offers")
      .select("*");

    const { data: orderData } = await supabase
      .from("orders")
      .select("*");

    setBusinesses(businessData || []);
    setOffers(offerData || []);
    setOrders(orderData || []);
    setLoading(false);
  }

  async function approveBusiness(id: number) {
    const { error } = await supabase
      .from("businesses")
      .update({ approved: true })
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Business approved.");
    checkAdminAndLoadData();
  }

  async function moveToPending(id: number) {
    const { error } = await supabase
      .from("businesses")
      .update({ approved: false })
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Business moved to pending.");
    checkAdminAndLoadData();
  }

  useEffect(() => {
    checkAdminAndLoadData();
  }, []);

  const pendingBusinesses = businesses.filter((business) => !business.approved);
  const approvedBusinesses = businesses.filter((business) => business.approved);
  const activeOffers = offers.filter((offer) => offer.active);
  const reservedOrders = orders.filter((order) => order.status === "reserved");

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F6EF]">
        <Navbar />
        <section className="px-6 py-12 md:px-12">
          <h1 className="text-4xl font-black">Loading admin panel...</h1>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F6EF]">
      <Navbar />

      <section className="px-6 py-12 md:px-12">
        <h1 className="text-5xl font-black">Admin Panel</h1>
        <p className="mt-3 text-gray-600">
          Manage businesses, offers, and platform activity.
        </p>

        {message && (
          <p className="mt-4 font-semibold text-green-700">{message}</p>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-gray-500">Businesses</p>
            <h2 className="mt-2 text-4xl font-black">{businesses.length}</h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-gray-500">Pending</p>
            <h2 className="mt-2 text-4xl font-black text-yellow-600">
              {pendingBusinesses.length}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-gray-500">Active Offers</p>
            <h2 className="mt-2 text-4xl font-black text-green-700">
              {activeOffers.length}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-gray-500">Reserved Orders</p>
            <h2 className="mt-2 text-4xl font-black">
              {reservedOrders.length}
            </h2>
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-black">Pending Businesses</h2>

          <div className="mt-6 grid gap-4">
            {pendingBusinesses.length === 0 && (
              <p className="text-gray-600">No pending businesses.</p>
            )}

            {pendingBusinesses.map((business) => (
              <div
                key={business.id}
                className="flex flex-col gap-4 rounded-2xl border p-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="text-xl font-black">{business.name}</h3>
                  <p className="text-gray-600">
                    {business.business_type} · {business.address}
                  </p>
                  <p className="text-gray-600">{business.phone}</p>
                  <p className="mt-2 inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700">
                    Pending approval
                  </p>
                </div>

                <button
                  onClick={() => approveBusiness(business.id)}
                  className="rounded-full bg-green-700 px-6 py-3 font-bold text-white"
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-black">Approved Businesses</h2>

          <div className="mt-6 grid gap-4">
            {approvedBusinesses.length === 0 && (
              <p className="text-gray-600">No approved businesses yet.</p>
            )}

            {approvedBusinesses.map((business) => (
              <div
                key={business.id}
                className="flex flex-col gap-4 rounded-2xl border p-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="text-xl font-black">{business.name}</h3>
                  <p className="text-gray-600">
                    {business.business_type} · {business.address}
                  </p>
                  <p className="text-gray-600">{business.phone}</p>
                  <p className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                    Approved
                  </p>
                </div>

                <button
                  onClick={() => moveToPending(business.id)}
                  className="rounded-full bg-red-600 px-6 py-3 font-bold text-white"
                >
                  Move to Pending
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}