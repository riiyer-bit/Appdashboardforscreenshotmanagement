import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Image, Clock, Trash2, X } from "lucide-react";
import { Badge } from "./ui/badge";

interface Screenshot {
  id: string;
  name: string;
  size: number;
  timestamp: Date;
  thumbnailUrl: string;
}

interface NewScreenshotNotificationProps {
  screenshot: Screenshot | null;
  onClose: () => void;
  onDeleteNow: () => void;
  onScheduleDelete: () => void;
}

export function NewScreenshotNotification({
  screenshot,
  onClose,
  onDeleteNow,
  onScheduleDelete,
}: NewScreenshotNotificationProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (screenshot) {
      const updateTimeLeft = () => {
        const now = new Date();
        const diff = now.getTime() - screenshot.timestamp.getTime();
        const seconds = Math.floor(diff / 1000);
        
        if (seconds < 60) {
          setTimeLeft(`${seconds} second${seconds !== 1 ? 's' : ''} ago`);
        } else {
          const minutes = Math.floor(seconds / 60);
          setTimeLeft(`${minutes} minute${minutes !== 1 ? 's' : ''} ago`);
        }
      };

      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 1000);
      return () => clearInterval(interval);
    }
  }, [screenshot]);

  if (!screenshot) return null;

  return (
    <Dialog open={!!screenshot} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Image className="size-6 text-green-600" />
              </div>
              <div>
                <DialogTitle>New Screenshot Saved</DialogTitle>
                <DialogDescription className="mt-1">
                  Stored {timeLeft}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Screenshot Preview Card */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-gradient-to-br from-slate-50 to-white">
            {/* Image Preview */}
            <div className="relative w-full h-48 bg-slate-100">
              <img
                src={screenshot.thumbnailUrl}
                alt={screenshot.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-3 right-3 bg-green-100 text-green-700 border-green-200">
                New
              </Badge>
            </div>
            
            {/* File Info */}
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <Image className="size-5 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">
                    {screenshot.name}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {(screenshot.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Options */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">
              What would you like to do?
            </p>

            {/* Schedule Delete Option */}
            <button
              onClick={onScheduleDelete}
              className="w-full p-4 border-2 border-slate-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <Clock className="size-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">
                    Delete in 1 Hour
                  </p>
                  <p className="text-sm text-slate-500">
                    Automatically remove this screenshot after 1 hour
                  </p>
                </div>
              </div>
            </button>

            {/* Delete Now Option */}
            <button
              onClick={onDeleteNow}
              className="w-full p-4 border-2 border-slate-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                  <Trash2 className="size-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">
                    Delete Now
                  </p>
                  <p className="text-sm text-slate-500">
                    Remove this screenshot immediately
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            <X className="size-4 mr-2" />
            Keep Screenshot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}