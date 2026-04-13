import { HeartPulse, ActivitySquare, TrendingUp } from "lucide-react";
import { AddReadingModal } from "@/components/AddReadingModal";
import { BPChart } from "@/components/BPChart";
import { BPList } from "@/components/BPList";
import { useReadings } from "@/hooks/use-readings";
import { getBPStatus } from "@/lib/bp-utils";

export default function Dashboard() {
  const { data: readings, isLoading, error } = useReadings();

  // Derive some quick stats from the latest reading
  const latestReading = readings && readings.length > 0 
    ? [...readings].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0] 
    : null;

  const latestStatus = latestReading 
    ? getBPStatus(latestReading.systolic, latestReading.diastolic) 
    : null;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="bg-destructive/10 text-destructive p-6 rounded-3xl max-w-md w-full text-center">
          <h2 className="text-xl font-bold mb-2">Failed to load vitals</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden selection:bg-primary/20">
      {/* Decorative background blur elements */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />
      
      <main className="max-w-[760px] mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-primary mb-2">
              <div className="p-2.5 bg-primary/10 rounded-2xl">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="font-display font-bold tracking-widest uppercase text-sm">PulseTrack</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-foreground tracking-tight">
              Your <span className="text-gradient">Vitals</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium max-w-md">
              Monitor your blood pressure and heart rate to stay on top of your health.
            </p>
          </div>
          
          <div className="shrink-0">
            <AddReadingModal />
          </div>
        </header>

        {isLoading ? (
          <div className="space-y-8 animate-pulse">
            <div className="h-[400px] bg-muted/40 rounded-3xl" />
            <div className="h-32 bg-muted/40 rounded-3xl" />
            <div className="h-32 bg-muted/40 rounded-3xl" />
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Top Quick Stats / Chart Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Highlight Card */}
              <div className="col-span-1 glass-panel rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-muted-foreground mb-6 flex items-center gap-2">
                    <ActivitySquare className="w-5 h-5" />
                    Latest Reading
                  </h3>
                  
                  {latestReading && latestStatus ? (
                    <div className="space-y-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-display font-black text-foreground tracking-tighter">
                          {latestReading.systolic}
                        </span>
                        <span className="text-2xl text-muted-foreground font-bold">/</span>
                        <span className="text-4xl font-display font-bold text-muted-foreground">
                          {latestReading.diastolic}
                        </span>
                      </div>
                      <div className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider border ${latestStatus.colorClass} ${latestStatus.textColor} ${latestStatus.borderColor}`}>
                        {latestStatus.label}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xl font-medium text-muted-foreground/50">No data available</p>
                  )}
                </div>
                
                {latestReading?.heartRate && (
                  <div className="mt-8 pt-6 border-t border-border/50">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Heart Rate</p>
                    <p className="text-2xl font-bold flex items-center gap-2">
                      {latestReading.heartRate} <span className="text-base font-medium text-muted-foreground">BPM</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Chart Card */}
              <div className="col-span-1 lg:col-span-2 glass-panel rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Trends
                  </h3>
                  <div className="flex items-center gap-4 text-sm font-medium">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-muted-foreground">SYS</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-blue-400" />
                      <span className="text-muted-foreground">DIA</span>
                    </div>
                  </div>
                </div>
                
                <BPChart readings={readings || []} />
              </div>
            </div>

            {/* History Section */}
            <div className="pt-8">
              <h3 className="text-2xl font-display font-bold text-foreground mb-6">History</h3>
              <BPList readings={readings || []} />
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
