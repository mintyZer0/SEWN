export function AdminTopCategories() {
  const categoriesList = [
    { name: "Tops", color: "bg-primary", price: "P24M" },
    { name: "Pants", color: "bg-primary/70", price: "P11M" },
    { name: "Dress", color: "bg-primary-light", price: "P4.5M" },
    { name: "Suits", color: "bg-primary/20", price: "P3.5M" },
    { name: "Polo", color: "bg-primary/10", price: "P2.4M" },
  ];

  return (
    <div className="bg-primary/5 p-6 rounded-2xl shadow-sm">
      <h2 className="text-primary text-2xl font-normal mb-6">Top Categories</h2>
      
      {/* Vertical Bars Chart */}
      <div className="flex gap-2 items-end h-24 mb-6">
        <div className="w-4 h-full bg-primary/10" />
        <div className="w-6 h-full bg-primary/20" />
        <div className="w-8 h-full bg-primary-light" />
        <div className="w-12 h-full bg-primary/70" />
        <div className="flex-1 h-full bg-primary" />
      </div>

      {/* Categories List */}
      <div className="space-y-3">
        {categoriesList.map((cat, i) => (
          <div key={i} className="flex justify-between items-center text-primary text-lg font-normal">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-sm ${cat.color}`} />
              <span>{cat.name}</span>
            </div>
            <span>{cat.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
