import { HardDrive, Image, Clock, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface DashboardStatsProps {
  totalStorage: number;
  usedStorage: number;
  totalScreenshots: number;
  recentScreenshots: number;
}

export function DashboardStats({
  totalStorage,
  usedStorage,
  totalScreenshots,
  recentScreenshots,
}: DashboardStatsProps) {
  const usagePercentage = (usedStorage / totalStorage) * 100;

  const stats = [
    {
      title: "Total Storage",
      value: `${totalStorage} GB`,
      icon: HardDrive,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Used Storage",
      value: `${usedStorage.toFixed(2)} GB`,
      icon: HardDrive,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      subtitle: `${usagePercentage.toFixed(1)}% used`,
    },
    {
      title: "Total Screenshots",
      value: totalScreenshots.toString(),
      icon: Image,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Recent (2hrs)",
      value: recentScreenshots.toString(),
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`size-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.subtitle && (
              <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
