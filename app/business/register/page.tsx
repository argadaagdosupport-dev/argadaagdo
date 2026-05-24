"use client";

import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function BusinessRegisterPage() {
  const [name, setName] = useState("");
  const [businessType, setBusinessType] = useState("Cafe");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  async function registerBusiness() {
    setMessage("");

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    if (!name.trim()) {
      setMessage("Business name is required.");
      return;
    }

    if (!address.trim()) {
      setMessage("Address is required.");
      return;
    }

    if (!phone.trim()) {
      setMessage("Phone number is required.");
      return;
    }

    const { error } = await supabase.from("businesses").insert({
      owner_id: userData.user.id,
      name,
      business_type: businessType,
      address,
      phone,
      approved: false,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setName("");
    setBusinessType("Cafe");
    setAddress("");
    setPhone("");

    setMessage("Business submitted. Waiting for admin approval.");
  }

  return (
    <main className="min-h-screen bg-[#F7F6EF] text-gray-900">
      <Navbar />

      <section className="px-6 py-10 md:px-12 md:py-14">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-8 shadow-sm md:p-12">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-green-700">
                For local businesses
              </p>

              <h1 className="mt-3 text-4xl font-black text-gray-950 md:text-6xl">
                Register your food business
              </h1>

              <p className="mt-5 text-lg font-medium leading-8 text-gray-700">
                Join ArGadaagdo and sell leftover food boxes to customers in
                Tbilisi. After admin approval, you can publish offers from your
                dashboard.
              </p>

              <div className="mt-8 grid gap-4">
                <div className="rounded-3xl bg-green-50 p-5">
                  <h3 className="text-xl font-black text-green-800">
                    1. Submit business
                  </h3>
                  <p className="mt-2 font-medium text-green-700">
                    Add your name, type, address and phone number.
                  </p>
                </div>

                <div className="rounded-3xl bg-yellow-50 p-5">
                  <h3 className="text-xl font-black text-yellow-800">
                    2. Wait for approval
                  </h3>
                  <p className="mt-2 font-medium text-yellow-700">
                    Admin reviews and approves your business.
                  </p>
                </div>

                <div className="rounded-3xl bg-green-50 p-5">
                  <h3 className="text-xl font-black text-green-800">
                    3. Publish offers
                  </h3>
                  <p className="mt-2 font-medium text-green-700">
                    Create pickup-only food rescue offers.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border bg-[#F7F6EF] p-6">
              <h2 className="text-2xl font-black text-gray-950">
                Business details
              </h2>

              <div className="mt-6 grid gap-4">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Business name"
                  className="rounded-2xl border bg-white p-4 font-medium outline-none"
                />

                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="rounded-2xl border bg-white p-4 font-medium outline-none"
                >
                  <option value="Cafe">Cafe</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Supermarket">Supermarket</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Other">Other</option>
                </select>

                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address in Tbilisi"
                  className="rounded-2xl border bg-white p-4 font-medium outline-none"
                />

                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                  className="rounded-2xl border bg-white p-4 font-medium outline-none"
                />

                <button
                  onClick={registerBusiness}
                  className="rounded-full bg-green-700 px-8 py-4 font-black text-white transition hover:bg-green-800"
                >
                  Submit for Approval
                </button>

                {message && (
                  <div className="rounded-2xl bg-green-100 p-4 font-bold text-green-700">
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}