"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  async function loadUser() {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[#F7F6EF]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-12">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-700 text-xl text-white">
            🥡
          </div>

          <div>
            <h1 className="text-2xl font-black text-green-800">
              ArGadaagdo
            </h1>

            <p className="text-xs font-bold text-gray-500">
              Food rescue marketplace
            </p>
          </div>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/offers"
            className="rounded-full px-5 py-3 font-black text-gray-700 transition hover:bg-white"
          >
            Offers
          </Link>

          <Link
            href="/orders"
            className="rounded-full px-5 py-3 font-black text-gray-700 transition hover:bg-white"
          >
            Orders
          </Link>

          <Link
            href="/business/dashboard"
            className="rounded-full px-5 py-3 font-black text-gray-700 transition hover:bg-white"
          >
            Dashboard
          </Link>

          {!user && (
            <>
              <Link
                href="/login"
                className="rounded-full bg-white px-5 py-3 font-black text-gray-900 shadow-sm"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-full bg-green-700 px-5 py-3 font-black text-white transition hover:bg-green-800"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={logout}
              className="rounded-full bg-red-600 px-5 py-3 font-black text-white transition hover:bg-red-700"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
