import { useEffect, useState } from "react";
import { Clock, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

interface ScheduledDeletion {
  screenshotId: string;
  screenshotName: string;
  scheduledTime: Date;
}

interface ScheduledDeletionsProps {
  scheduledDeletions: ScheduledDeletion[];
  onCancel: (screenshotId: string) => void;
}

export function ScheduledDeletions({
  scheduledDeletions,
  onCancel,
}: ScheduledDeletionsProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (scheduledDeletions.length === 0) return null;

  const getTimeRemaining = (scheduledTime: Date) => {
    const now = new Date();
    const diff = scheduledTime.getTime() - now.getTime();
    
    if (diff <= 0) return { text: "Deleting...", progress: 100 };
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    const totalDuration = 60 * 60 * 1000; // 1 hour in milliseconds
    const elapsed = totalDuration - diff;
    const progress = (elapsed / totalDuration) * 100;
    
    return {
      text: `${minutes}m ${seconds}s remaining`,
      progress: Math.min(progress, 100),
    };
  };

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-900">
          <Clock className="size-5" />
          Scheduled Deletions ({scheduledDeletions.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {scheduledDeletions.map((deletion) => {
          const { text, progress } = getTimeRemaining(deletion.scheduledTime);
          
          return (
            <div
              key={deletion.screenshotId}
              className="bg-white border border-orange-200 rounded-lg p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-900 text-sm truncate flex-1">
                  {deletion.screenshotName}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCancel(deletion.screenshotId)}
                  className="h-8 px-2 hover:bg-red-100 hover:text-red-700"
                >
                  <X className="size-4" />
                </Button>
              </div>
              <div className="space-y-1">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-slate-500">{text}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
