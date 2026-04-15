import { Image, Calendar, HardDrive } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface Screenshot {
  id: string;
  name: string;
  size: number;
  timestamp: Date;
  thumbnailUrl: string;
}

interface ScreenshotListProps {
  screenshots: Screenshot[];
}

export function ScreenshotList({ screenshots }: ScreenshotListProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
    }
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    }
    
    return date.toLocaleDateString();
  };

  const isRecent = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours <= 2;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Screenshots</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {screenshots.map((screenshot) => (
            <div
              key={screenshot.id}
              className="flex items-center gap-4 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="relative w-20 h-20 rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
                <img
                  src={screenshot.thumbnailUrl}
                  alt={screenshot.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-900 truncate">
                    {screenshot.name}
                  </p>
                  {isRecent(screenshot.timestamp) && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      Recent
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {formatDate(screenshot.timestamp)}
                  </span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="size-3" />
                    {(screenshot.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}