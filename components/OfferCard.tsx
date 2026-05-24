import { Offer } from "@/lib/types";

export default function OfferCard({ offer }: { offer: Offer }) {
  return (
    <div className="group overflow-hidden rounded-[2rem] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative flex h-56 items-center justify-center bg-gradient-to-br from-green-100 to-yellow-100 text-8xl">
        {offer.emoji}

        <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-black text-green-700 shadow-sm">
          {offer.type}
        </div>

        <div className="absolute right-4 top-4 rounded-full bg-red-600 px-4 py-2 text-sm font-black text-white shadow-sm">
          Save
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-3xl font-black leading-tight text-gray-950">
              {offer.title}
            </h4>

            <p className="mt-2 text-lg font-bold text-gray-700">
              {offer.place}
            </p>
          </div>

          <div className="rounded-2xl bg-green-50 px-4 py-3 text-center">
            <p className="text-xs font-black uppercase tracking-wide text-green-700">
              Left
            </p>

            <p className="text-2xl font-black text-green-800">
              {offer.quantity}
            </p>
          </div>
        </div>

        <p className="mt-4 font-medium text-gray-500">
          📍 {offer.location}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-800">
            ⏰ {offer.time}
          </span>

          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-800">
            Pickup only
          </span>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div>
            <span className="text-4xl font-black text-green-700">
              {offer.price}
            </span>

            <span className="ml-3 text-lg font-bold text-gray-400 line-through">
              {offer.oldPrice}
            </span>
          </div>

          <button className="rounded-full bg-green-700 px-6 py-3 font-black text-white transition hover:bg-green-800">
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
}