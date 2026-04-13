export function AdminActiveUsers() {
  const users = [
    { country: "Philippines", percentage: 45 },
    { country: "China", percentage: 27 },
    { country: "Indonesia", percentage: 11 },
    { country: "Malaysia", percentage: 4 },
  ];

  return (
    <div className="bg-primary/5 p-6 rounded-2xl shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-primary text-2xl font-normal">Active Users</h2>
        <span className="text-emerald-500 font-bold text-sm">+4.2%</span>
      </div>
      <div className="mb-6">
        <span className="text-primary text-3xl font-black">2455</span>
      </div>
      
      <div className="space-y-4">
        {users.map((item, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-primary text-sm">
              <span>{item.country}</span>
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
