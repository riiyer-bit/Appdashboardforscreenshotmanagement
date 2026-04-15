import { useState, useEffect } from "react";
import { DashboardStats } from "./components/DashboardStats";
import { ScreenshotList } from "./components/ScreenshotList";
import { StorageCleanupDialog } from "./components/StorageCleanupDialog";
import { NewScreenshotNotification } from "./components/NewScreenshotNotification";
import { ScheduledDeletions } from "./components/ScheduledDeletions";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { Button } from "./components/ui/button";
import { Plus } from "lucide-react";

interface Screenshot {
  id: string;
  name: string;
  size: number; // in bytes
  timestamp: Date;
  thumbnailUrl: string;
}

interface ScheduledDeletion {
  screenshotId: string;
  screenshotName: string;
  scheduledTime: Date;
}

// Generate mock screenshot data
const generateMockScreenshots = (): Screenshot[] => {
  const screenshots: Screenshot[] = [];
  const now = new Date();
  
  const mockImages = [
    "https://images.unsplash.com/photo-1659449538037-41550dc1ec45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHNjcmVlbiUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NzYyMjUyNzZ8MA&ixlib=rb-4.1.0&q=80&w=400",
    "https://images.unsplash.com/photo-1605108222700-0d605d9ebafe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzc2MjIxMjA4fDA&ixlib=rb-4.1.0&q=80&w=400",
    "https://images.unsplash.com/photo-1707836868495-3307d371aba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWJzaXRlJTIwZGVzaWduJTIwbW9ja3VwfGVufDF8fHx8MTc3NjIyMDM0Mnww&ixlib=rb-4.1.0&q=80&w=400",
    "https://images.unsplash.com/photo-1753998943413-8cba1b923c0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RlJTIwZWRpdG9yJTIwc2NyZWVufGVufDF8fHx8MTc3NjE3NjU4N3ww&ixlib=rb-4.1.0&q=80&w=400",
    "https://images.unsplash.com/photo-1762427354251-f008b64dbc32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGNoYXJ0fGVufDF8fHx8MTc3NjIwODczN3ww&ixlib=rb-4.1.0&q=80&w=400",
    "https://images.unsplash.com/photo-1700887937204-69f8b8400ace?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGludGVyZmFjZSUyMGRlc2lnbnxlbnwxfHx8fDE3NzYyMjUyNzl8MA&ixlib=rb-4.1.0&q=80&w=400",
  ];

  // Recent screenshots (within 2 hours)
  const recentCount = 8;
  for (let i = 0; i < recentCount; i++) {
    const minutesAgo = Math.floor(Math.random() * 120); // 0-120 minutes ago
    const timestamp = new Date(now.getTime() - minutesAgo * 60000);
    screenshots.push({
      id: `recent-${i}`,
      name: `Screenshot_${timestamp.getHours()}-${timestamp.getMinutes()}-${timestamp.getSeconds()}.png`,
      size: Math.floor(Math.random() * 5 * 1024 * 1024) + 1024 * 1024, // 1-6 MB
      timestamp,
      thumbnailUrl: mockImages[i % mockImages.length],
    });
  }

  // Older screenshots
  const olderCount = 12;
  for (let i = 0; i < olderCount; i++) {
    const hoursAgo = Math.floor(Math.random() * 168) + 3; // 3-171 hours ago (beyond 2 hours)
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60000);
    screenshots.push({
      id: `older-${i}`,
      name: `Screenshot_${timestamp.getMonth() + 1}-${timestamp.getDate()}_${i + 1}.png`,
      size: Math.floor(Math.random() * 5 * 1024 * 1024) + 1024 * 1024, // 1-6 MB
      timestamp,
      thumbnailUrl: mockImages[i % mockImages.length],
    });
  }

  return screenshots.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export default function App() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>(() => generateMockScreenshots());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newScreenshot, setNewScreenshot] = useState<Screenshot | null>(null);
  const [scheduledDeletions, setScheduledDeletions] = useState<ScheduledDeletion[]>([]);

  // Calculate storage stats
  const totalStorage = 128; // GB
  const usedStorage = screenshots.reduce((acc, s) => acc + s.size, 0) / (1024 * 1024 * 1024);

  // Get recent screenshots (within 2 hours)
  const recentScreenshots = screenshots.filter((s) => {
    const now = new Date();
    const diffMs = now.getTime() - s.timestamp.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours <= 2;
  });

  // Show dialog automatically on mount (simulating a notification)
  useEffect(() => {
    if (recentScreenshots.length > 0) {
      const timer = setTimeout(() => {
        setDialogOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [recentScreenshots.length]);

  // Check for scheduled deletions that should be executed
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      scheduledDeletions.forEach((deletion) => {
        if (deletion.scheduledTime.getTime() <= now.getTime()) {
          // Delete the screenshot
          setScreenshots((prev) => prev.filter((s) => s.id !== deletion.screenshotId));
          setScheduledDeletions((prev) =>
            prev.filter((d) => d.screenshotId !== deletion.screenshotId)
          );
          
          const screenshot = screenshots.find((s) => s.id === deletion.screenshotId);
          if (screenshot) {
            toast.success(
              `Deleted ${deletion.screenshotName} and cleared ${(screenshot.size / (1024 * 1024)).toFixed(2)} MB`
            );
          }
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [scheduledDeletions, screenshots]);

  const handleDeleteScreenshots = () => {
    const recentIds = new Set(recentScreenshots.map((s) => s.id));
    setScreenshots((prev) => prev.filter((s) => !recentIds.has(s.id)));
    toast.success(`Deleted ${recentScreenshots.length} screenshots and cleared ${(recentScreenshots.reduce((acc, s) => acc + s.size, 0) / (1024 * 1024)).toFixed(2)} MB`);
  };

  const handleAddNewScreenshot = () => {
    const now = new Date();
    const mockImages = [
      "https://images.unsplash.com/photo-1659449538037-41550dc1ec45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHNjcmVlbiUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NzYyMjUyNzZ8MA&ixlib=rb-4.1.0&q=80&w=400",
      "https://images.unsplash.com/photo-1605108222700-0d605d9ebafe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzc2MjIxMjA4fDA&ixlib=rb-4.1.0&q=80&w=400",
      "https://images.unsplash.com/photo-1707836868495-3307d371aba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWJzaXRlJTIwZGVzaWduJTIwbW9ja3VwfGVufDF8fHx8MTc3NjIyMDM0Mnww&ixlib=rb-4.1.0&q=80&w=400",
      "https://images.unsplash.com/photo-1753998943413-8cba1b923c0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RlJTIwZWRpdG9yJTIwc2NyZWVufGVufDF8fHx8MTc3NjE3NjU4N3ww&ixlib=rb-4.1.0&q=80&w=400",
      "https://images.unsplash.com/photo-1762427354251-f008b64dbc32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGNoYXJ0fGVufDF8fHx8MTc3NjIwODczN3ww&ixlib=rb-4.1.0&q=80&w=400",
      "https://images.unsplash.com/photo-1700887937204-69f8b8400ace?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGludGVyZmFjZSUyMGRlc2lnbnxlbnwxfHx8fDE3NzYyMjUyNzl8MA&ixlib=rb-4.1.0&q=80&w=400",
    ];
    
    const newScreenshotData: Screenshot = {
      id: `new-${Date.now()}`,
      name: `Screenshot_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}.png`,
      size: Math.floor(Math.random() * 5 * 1024 * 1024) + 1024 * 1024,
      timestamp: now,
      thumbnailUrl: mockImages[Math.floor(Math.random() * mockImages.length)],
    };
    
    setScreenshots((prev) => [newScreenshotData, ...prev]);
    setNewScreenshot(newScreenshotData);
  };

  const handleScheduleDelete = () => {
    if (!newScreenshot) return;
    
    const scheduledTime = new Date(newScreenshot.timestamp.getTime() + 60 * 60 * 1000); // 1 hour from now
    
    setScheduledDeletions((prev) => [
      ...prev,
      {
        screenshotId: newScreenshot.id,
        screenshotName: newScreenshot.name,
        scheduledTime,
      },
    ]);
    
    toast.success(`Scheduled ${newScreenshot.name} for deletion in 1 hour`);
    setNewScreenshot(null);
  };

  const handleDeleteNow = () => {
    if (!newScreenshot) return;
    
    setScreenshots((prev) => prev.filter((s) => s.id !== newScreenshot.id));
    toast.success(
      `Deleted ${newScreenshot.name} and cleared ${(newScreenshot.size / (1024 * 1024)).toFixed(2)} MB`
    );
    setNewScreenshot(null);
  };

  const handleCancelScheduledDeletion = (screenshotId: string) => {
    const deletion = scheduledDeletions.find((d) => d.screenshotId === screenshotId);
    setScheduledDeletions((prev) => prev.filter((d) => d.screenshotId !== screenshotId));
    
    if (deletion) {
      toast.info(`Cancelled scheduled deletion of ${deletion.screenshotName}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900">Storage Dashboard</h1>
            <p className="text-slate-600">Manage your screenshots and free up storage space</p>
          </div>
          <Button onClick={handleAddNewScreenshot} className="gap-2">
            <Plus className="size-4" />
            Simulate New Screenshot
          </Button>
        </div>

        {/* Stats */}
        <DashboardStats
          totalStorage={totalStorage}
          usedStorage={usedStorage}
          totalScreenshots={screenshots.length}
          recentScreenshots={recentScreenshots.length}
        />

        {/* Scheduled Deletions */}
        <ScheduledDeletions
          scheduledDeletions={scheduledDeletions}
          onCancel={handleCancelScheduledDeletion}
        />

        {/* Screenshot List */}
        <ScreenshotList screenshots={screenshots} />

        {/* Cleanup Dialog */}
        <StorageCleanupDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          screenshots={recentScreenshots}
          onDelete={handleDeleteScreenshots}
        />

        {/* New Screenshot Notification */}
        <NewScreenshotNotification
          screenshot={newScreenshot}
          onClose={() => setNewScreenshot(null)}
          onDeleteNow={handleDeleteNow}
          onScheduleDelete={handleScheduleDelete}
        />

        {/* Toast notifications */}
        <Toaster />
      </div>
    </div>
  );
}