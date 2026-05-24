export default function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-gray-500">{title}</p>
      <p className="mt-2 text-4xl font-black text-green-700">{value}</p>
    </div>
  );
}
