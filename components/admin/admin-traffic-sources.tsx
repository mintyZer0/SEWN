import { ExternalLink, Globe, Search, Share2 } from "lucide-react";

export function AdminTrafficSources() {
  const sourcesList = [
    { name: "Facebook", color: "bg-primary", percent: "57%" },
    { name: "Instagram", color: "bg-primary/70", percent: "23%" },
    { name: "Searches", color: "bg-primary-light", percent: "9%" },
    { name: "Link shares", color: "bg-primary/20", percent: "6%" },
    { name: "Emails", color: "bg-primary/10", percent: "5%" },
  ];

  return (
    <div className="bg-primary/5 p-6 rounded-2xl shadow-sm">
      <h2 className="text-primary text-2xl font-normal mb-6">Traffic Sources</h2>
      
      {/* Vertical Bars Chart */}
      <div className="flex gap-2 items-end h-24 mb-6">
        <div className="w-4 h-full bg-primary/10" />
        <div className="w-6 h-full bg-primary/20" />
        <div className="w-8 h-full bg-primary-light" />
        <div className="w-12 h-full bg-primary/70" />
        <div className="flex-1 h-full bg-primary" />
      </div>

      {/* Sources List */}
      <div className="space-y-3">
        {sourcesList.map((source, i) => (
          <div key={i} className="flex justify-between items-center text-primary text-lg font-normal">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-sm ${source.color}`} />
              <span>{source.name}</span>
            </div>
            <span>{source.percent}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
