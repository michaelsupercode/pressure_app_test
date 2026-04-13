import { format } from 'date-fns';
import { Heart, Trash2, Calendar, Droplets } from 'lucide-react';
import type { Reading } from '@shared/schema';
import { getBPStatus } from '@/lib/bp-utils';
import { useDeleteReading } from '@/hooks/use-readings';
import { Button } from '@/components/ui/button';

interface BPListProps {
  readings: Reading[];
}

export function BPList({ readings }: BPListProps) {
  const { mutate: deleteReading, isPending: isDeleting } = useDeleteReading();

  // Sort descending for the list
  const sorted = [...readings].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (readings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center glass-panel rounded-3xl">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Droplets className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-display font-bold text-foreground">No readings yet</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          Start tracking your blood pressure by adding your first reading above. Monitor your health journey over time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sorted.map((reading) => {
        const status = getBPStatus(reading.systolic, reading.diastolic);
        
        return (
          <div
            key={reading.id}
            className="group relative bg-card p-3 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            {/* Status accent line on the left */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${status.colorClass.split(' ')[0]}`} />

            <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between ml-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-3">
                  <h4 className="text-2xl font-display font-bold text-foreground">
                    {reading.systolic}
                    <span className="text-muted-foreground font-normal text-lg mx-1">/</span>
                    {reading.diastolic}
                  </h4>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${status.colorClass} ${status.textColor} ${status.borderColor}`}>
                    {status.label}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(reading.timestamp), 'MMM d, yyyy • h:mm a')}
                  </span>
                  
                  {reading.heartRate && (
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                      {reading.heartRate} BPM
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-1 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-border/50">
                {reading.notes ? (
                  <p className="text-sm italic text-muted-foreground bg-muted/50 px-3 py-2 rounded-xl flex-1 sm:max-w-[200px] truncate">
                    "{reading.notes}"
                  </p>
                ) : (
                  <div className="flex-1 sm:hidden"></div>
                )}
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                  disabled={isDeleting}
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this reading?")) {
                      deleteReading(reading.id);
                    }
                  }}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
