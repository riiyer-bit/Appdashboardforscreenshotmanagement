import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Trash2, HardDrive } from "lucide-react";

interface Screenshot {
  id: string;
  name: string;
  size: number;
  timestamp: Date;
}

interface StorageCleanupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  screenshots: Screenshot[];
  onDelete: () => void;
}

export function StorageCleanupDialog({
  open,
  onOpenChange,
  screenshots,
  onDelete,
}: StorageCleanupDialogProps) {
  const totalSize = screenshots.reduce((acc, screenshot) => acc + screenshot.size, 0);
  const formattedSize = (totalSize / (1024 * 1024)).toFixed(2);

  const handleDelete = () => {
    onDelete();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-full">
              <HardDrive className="size-6 text-orange-600" />
            </div>
            <DialogTitle>Storage Cleanup</DialogTitle>
          </div>
          <DialogDescription>
            We found {screenshots.length} screenshot{screenshots.length !== 1 ? "s" : ""} taken in the last 2 hours
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Storage to clear</span>
              <span className="text-2xl font-semibold text-slate-900">
                {formattedSize} MB
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Screenshots to delete:</p>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {screenshots.map((screenshot) => (
                <div
                  key={screenshot.id}
                  className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-md text-sm"
                >
                  <span className="text-slate-700 truncate flex-1">
                    {screenshot.name}
                  </span>
                  <span className="text-slate-500 ml-2">
                    {(screenshot.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Keep Files
          </Button>
          <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            <Trash2 className="size-4 mr-2" />
            Delete All
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
