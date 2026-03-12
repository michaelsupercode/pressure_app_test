import { useMemo } from 'react';
import { format } from 'date-fns';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceArea
} from 'recharts';
import type { Reading } from '@shared/schema';

interface BPChartProps {
  readings: Reading[];
}

export function BPChart({ readings }: BPChartProps) {
  // Sort readings chronologically and map to chart format
  const data = useMemo(() => {
    return [...readings]
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(r => ({
        ...r,
        formattedTime: format(new Date(r.timestamp), 'MMM d, h:mm a'),
        dayTime: format(new Date(r.timestamp), 'MMM d')
      }));
  }, [readings]);

  if (readings.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-muted/30 rounded-3xl border border-dashed border-muted-foreground/20">
        <p className="text-muted-foreground font-medium">Log your first reading to see trends</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[350px] md:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSys" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorDia" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          
          <XAxis 
            dataKey="dayTime" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }}
            dy={10}
            minTickGap={30}
          />
          
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }}
            domain={['dataMin - 10', 'dataMax + 10']}
          />
          
          {/* Reference area indicating a generic "Normal" range zone - highly contextual but visual nice */}
          <ReferenceArea y1={80} y2={120} fill="hsl(142 71% 45%)" fillOpacity={0.05} />
          
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-background/95 backdrop-blur-md border border-border p-4 rounded-xl shadow-xl">
                    <p className="text-sm text-muted-foreground font-semibold mb-2">{payload[0].payload.formattedTime}</p>
                    <div className="space-y-1">
                      <p className="text-primary font-bold text-lg">
                        SYS: {payload[0].value} <span className="text-sm font-medium text-muted-foreground">mmHg</span>
                      </p>
                      <p className="text-blue-500 font-bold text-lg">
                        DIA: {payload[1].value} <span className="text-sm font-medium text-muted-foreground">mmHg</span>
                      </p>
                      {payload[0].payload.heartRate && (
                        <p className="text-rose-500 font-bold mt-2">
                          ♥ {payload[0].payload.heartRate} <span className="text-sm font-medium text-muted-foreground">BPM</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          
          <Area 
            type="monotone" 
            dataKey="systolic" 
            stroke="hsl(217 91% 60%)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorSys)" 
            activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(217 91% 60%)" }}
          />
          
          <Area 
            type="monotone" 
            dataKey="diastolic" 
            stroke="hsl(199 89% 48%)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorDia)" 
            activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(199 89% 48%)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
