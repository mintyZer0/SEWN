export function AdminConversionRate() {
  const conversions = [
    { label: "Product Views", percentage: 65 },
    { label: "Add to cart", percentage: 22 },
    { label: "Checkout", percentage: 7 },
    { label: "Commissions", percentage: 5 },
    { label: "Abondoned Carts", percentage: 34 },
  ];

  return (
    <div className="bg-primary/5 p-6 rounded-2xl shadow-sm">
      <h2 className="text-primary text-2xl font-normal mb-8">Conversion Rate</h2>
      
      <div className="space-y-4">
        {conversions.map((item, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-primary text-sm">
              <span>{item.label}</span>
              <span>{item.percentage}%</span>
            </div>
            <div className="h-3 w-full bg-white rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary/70 rounded-full"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
