export function AdminRevenueChart() {
  const revenueData = [
    { month: "03/23", revenue: 100 },
    { month: "03/24", revenue: 88 },
    { month: "03/25", revenue: 82 },
    { month: "03/26", revenue: 86 },
    { month: "03/27", revenue: 76 },
    { month: "03/28", revenue: 90 },
  ];

  const yAxisLabels = ["100k", "90k", "80k", "70k", "60k"];

  return (
    <div className="bg-primary/5 p-6 rounded-2xl shadow-sm flex flex-col h-[350px]">
      <h2 className="text-3xl font-normal text-primary mb-6">Revenue Statistics</h2>

      <div className="flex-1 flex w-full relative pl-12 pr-4 pb-8">
        
        {/* Y Axis Labels */}
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-primary/70 text-sm">
          {yAxisLabels.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>

        {/* X Axis Line */}
        <div className="absolute bottom-8 left-12 right-4 h-px bg-primary/20" />

        {/* Bars Container */}
        <div className="flex-1 flex justify-between items-end gap-2 sm:gap-4 relative z-10 pt-4">
          {revenueData.map((data, i) => {
            // Mapping values: 60k is baseline (0% height), 100k is top (100% height)
            const percentage = ((data.revenue - 60) / 40) * 100;
            
            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                <div 
                  className="w-full max-w-[60px] bg-primary transition-all duration-700 hover:opacity-80"
                  style={{ height: `${percentage}%` }}
                />
                <span className="text-primary/70 text-xs sm:text-sm mt-2 absolute -bottom-6">
                  {data.month}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
