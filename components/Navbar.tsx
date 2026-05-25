"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getCurrentRole, getCurrentUser, logoutUser } from "@/lib/auth";

export default function Navbar() {
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    async function loadNavbar() {
      const currentUser = await getCurrentUser();
      const currentRole = await getCurrentRole();

      setUser(currentUser);
      setRole(currentRole);
    }

    loadNavbar();
  }, []);

  const linkClass = (href: string) => {
    const active = pathname === href;

    return `rounded-full px-4 py-2 font-bold transition ${
      active
        ? "bg-green-100 text-green-800"
        : "text-gray-700 hover:bg-white hover:text-gray-950"
    }`;
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-black/5 bg-[#F7F6EF]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-700 text-xl text-white shadow-sm">
            🥡
          </div>

          <div>
            <h1 className="text-xl font-black leading-none text-green-800 md:text-2xl">
              ArGadaagdo
            </h1>
            <p className="hidden text-xs font-bold text-gray-500 md:block">
              Food rescue marketplace
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/offers" className={linkClass("/offers")}>
            Offers
          </Link>

          {user && (
            <Link href="/orders" className={linkClass("/orders")}>
              Orders
            </Link>
          )}

          {role === "business" && (
            <Link
              href="/business/dashboard"
              className={linkClass("/business/dashboard")}
            >
              Dashboard
            </Link>
          )}

          {role === "admin" && (
            <Link href="/admin" className={linkClass("/admin")}>
              Admin
            </Link>
          )}

          {!user && (
            <Link
              href="/business/register"
              className={linkClass("/business/register")}
            >
              For Business
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={logoutUser}
              className="hidden rounded-full bg-red-600 px-5 py-2.5 font-black text-white transition hover:bg-red-700 md:block"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-full bg-green-700 px-5 py-2.5 font-black text-white transition hover:bg-green-800 md:block"
            >
              Sign In
            </Link>
          )}

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 font-black text-gray-900 shadow-sm md:hidden"
          >
            {mobileMenu ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {mobileMenu && (
        <div className="border-t border-gray-100 bg-[#F7F6EF] px-5 py-5 md:hidden">
          <div className="grid gap-3">
            <Link
              href="/offers"
              onClick={() => setMobileMenu(false)}
              className={linkClass("/offers")}
            >
              Offers
            </Link>

            {user && (
              <Link
                href="/orders"
                onClick={() => setMobileMenu(false)}
                className={linkClass("/orders")}
              >
                Orders
              </Link>
            )}

            {role === "business" && (
              <Link
                href="/business/dashboard"
                onClick={() => setMobileMenu(false)}
                className={linkClass("/business/dashboard")}
              >
                Dashboard
              </Link>
            )}

            {role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenu(false)}
                className={linkClass("/admin")}
              >
                Admin
              </Link>
            )}

            {!user && (
              <Link
                href="/business/register"
                onClick={() => setMobileMenu(false)}
                className={linkClass("/business/register")}
              >
                For Business
              </Link>
            )}

            <div className="mt-3 border-t pt-4">
              {user ? (
                <button
                  onClick={logoutUser}
                  className="w-full rounded-full bg-red-600 px-5 py-3 font-black text-white"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenu(false)}
                  className="block w-full rounded-full bg-green-700 px-5 py-3 text-center font-black text-white"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
