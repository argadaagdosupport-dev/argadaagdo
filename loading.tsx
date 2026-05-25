export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F6EF] px-6">
      <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
          🥡
        </div>

        <h1 className="mt-6 text-3xl font-black text-gray-950">
          Loading ArGadaagdo...
        </h1>

        <p className="mt-3 font-semibold text-gray-600">
          Preparing fresh food rescue offers.
        </p>
      </div>
    </main>
  );
}
