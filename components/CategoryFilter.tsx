export default function CategoryFilter() {
  const categories = [
    "All",
    "Bakery",
    "Cafe",
    "Restaurant",
    "Supermarket",
  ];

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {categories.map((category) => (
        <button
          key={category}
          className="rounded-full bg-white px-5 py-3 font-bold text-green-700 shadow-sm"
        >
          {category}
        </button>
      ))}
    </div>
  );
}
