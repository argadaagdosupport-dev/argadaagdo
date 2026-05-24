export default function BusinessCard() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-xl font-black">Green Bakery</p>
      <p className="mt-1 text-gray-500">Vake, Tbilisi</p>
      <div className="mt-5 flex gap-3">
        <button className="rounded-full bg-green-700 px-5 py-3 font-bold text-white">Approve</button>
        <button className="rounded-full bg-gray-100 px-5 py-3 font-bold">Reject</button>
      </div>
    </div>
  );
}
