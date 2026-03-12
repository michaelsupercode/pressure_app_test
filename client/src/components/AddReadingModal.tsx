import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Activity, HeartPulse, FileText, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCreateReading } from "@/hooks/use-readings";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Client-side schema with coercion for inputs
const formSchema = z.object({
  systolic: z.coerce.number({ invalid_type_error: "Required" }).min(50).max(300),
  diastolic: z.coerce.number({ invalid_type_error: "Required" }).min(30).max(200),
  heartRate: z.coerce.number().min(30).max(250).optional().or(z.literal("")),
  notes: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AddReadingModal() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateReading();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      systolic: undefined,
      diastolic: undefined,
      heartRate: "",
      notes: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    // Format payload for backend
    const payload = {
      systolic: data.systolic,
      diastolic: data.diastolic,
      heartRate: data.heartRate === "" ? null : Number(data.heartRate),
      notes: data.notes || null,
    };

    mutate(payload as any, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-2xl gap-2 font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all text-base px-6">
          <Plus className="w-5 h-5" />
          Log Reading
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 border-0 shadow-2xl rounded-3xl overflow-hidden bg-background">
        <div className="bg-gradient-to-r from-primary to-blue-500 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display text-white flex items-center gap-2">
              <Activity className="w-6 h-6" />
              New Vitals
            </DialogTitle>
            <DialogDescription className="text-blue-100/90 text-base">
              Enter your latest blood pressure and heart rate measurements.
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-1.5 text-muted-foreground">
                Systolic (SYS)
              </Label>
              <div className="relative">
                <Input 
                  {...register("systolic")} 
                  type="number" 
                  placeholder="120"
                  className="pl-4 pr-10 py-6 text-xl rounded-2xl bg-muted/50 border-transparent focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium pointer-events-none">
                  mmHg
                </span>
              </div>
              {errors.systolic && <span className="text-destructive text-sm font-medium">{errors.systolic.message}</span>}
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-1.5 text-muted-foreground">
                Diastolic (DIA)
              </Label>
              <div className="relative">
                <Input 
                  {...register("diastolic")} 
                  type="number" 
                  placeholder="80"
                  className="pl-4 pr-10 py-6 text-xl rounded-2xl bg-muted/50 border-transparent focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium pointer-events-none">
                  mmHg
                </span>
              </div>
              {errors.diastolic && <span className="text-destructive text-sm font-medium">{errors.diastolic.message}</span>}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-1.5 text-muted-foreground">
              <HeartPulse className="w-4 h-4 text-rose-500" />
              Heart Rate
            </Label>
            <div className="relative">
              <Input 
                {...register("heartRate")} 
                type="number" 
                placeholder="72"
                className="pl-4 pr-10 py-6 text-lg rounded-2xl bg-muted/50 border-transparent focus:bg-background focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium pointer-events-none">
                BPM
              </span>
            </div>
            {errors.heartRate && <span className="text-destructive text-sm font-medium">{errors.heartRate.message}</span>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-1.5 text-muted-foreground">
              <FileText className="w-4 h-4" />
              Notes <span className="text-muted-foreground/60 font-normal">(Optional)</span>
            </Label>
            <Textarea 
              {...register("notes")} 
              placeholder="How are you feeling?"
              className="resize-none rounded-2xl bg-muted/50 border-transparent focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all min-h-[100px]"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isPending} 
            className="w-full py-6 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            {isPending ? "Saving..." : "Save Reading"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
