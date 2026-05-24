"use client";

import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [message, setMessage] = useState("");

  async function createAccount() {
    setMessage("");

    if (!email.trim()) {
      setMessage("Email is required.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setMessage("Creating account...");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role },
      },
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        email,
        role,
      });

      if (profileError) {
        setMessage(profileError.message);
        return;
      }
    }

    setMessage("Account created. Now sign in.");
  }

  async function signIn() {
    setMessage("");

    if (!email.trim()) {
      setMessage("Email is required.");
      return;
    }

    if (!password.trim()) {
      setMessage("Password is required.");
      return;
    }

    setMessage("Signing in...");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    if (role === "business") {
      window.location.href = "/business/dashboard";
      return;
    }

    window.location.href = "/offers";
  }

  return (
    <main className="min-h-screen bg-[#F7F6EF] text-gray-900">
      <Navbar />

      <section className="px-6 py-10 md:px-12 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:items-center">
          <div className="rounded-[2rem] bg-green-800 p-8 text-white shadow-sm md:p-12">
            <p className="text-sm font-black uppercase tracking-widest text-green-100">
              Welcome back
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              Sign in and rescue food in Tbilisi
            </h1>

            <p className="mt-5 text-lg font-medium leading-8 text-green-50">
              Customers can reserve food offers. Businesses can publish leftover
              food boxes after admin approval.
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-3xl bg-white/10 p-5">
                <h3 className="text-xl font-black">For customers</h3>
                <p className="mt-2 font-medium text-green-50">
                  Browse discounted food and reserve pickup-only offers.
                </p>
              </div>

              <div className="rounded-3xl bg-white/10 p-5">
                <h3 className="text-xl font-black">For businesses</h3>
                <p className="mt-2 font-medium text-green-50">
                  Register your business and publish rescue offers.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-sm md:p-10">
            <h2 className="text-3xl font-black text-gray-950">
              Sign In / Register
            </h2>

            <p className="mt-2 font-medium text-gray-600">
              Use the same form to create an account or sign in.
            </p>

            <div className="mt-6 grid gap-4">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="rounded-2xl border bg-white p-4 font-medium outline-none"
              />

              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                className="rounded-2xl border bg-white p-4 font-medium outline-none"
              />

              <div>
                <p className="mb-3 font-black text-gray-800">
                  Account type
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => setRole("customer")}
                    className={`rounded-2xl border p-4 text-left font-bold ${
                      role === "customer"
                        ? "border-green-700 bg-green-50 text-green-800"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    <div className="text-2xl">🥡</div>
                    <p className="mt-2">Customer</p>
                    <p className="mt-1 text-sm font-medium">
                      Reserve food offers
                    </p>
                  </button>

                  <button
                    onClick={() => setRole("business")}
                    className={`rounded-2xl border p-4 text-left font-bold ${
                      role === "business"
                        ? "border-green-700 bg-green-50 text-green-800"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    <div className="text-2xl">🏪</div>
                    <p className="mt-2">Business</p>
                    <p className="mt-1 text-sm font-medium">
                      Publish food offers
                    </p>
                  </button>
                </div>
              </div>

              <button
                onClick={signIn}
                className="rounded-full bg-green-700 py-4 font-black text-white transition hover:bg-green-800"
              >
                Sign In
              </button>

              <button
                onClick={createAccount}
                className="rounded-full border border-gray-300 bg-white py-4 font-black text-gray-900 transition hover:bg-gray-50"
              >
                Create Account
              </button>

              {message && (
                <div className="rounded-2xl bg-green-100 p-4 font-bold text-green-700">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}