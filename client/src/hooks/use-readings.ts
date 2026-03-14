import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type Reading, type InsertReading } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { BASE_URL } from "@/lib/queryClient";

// Helper to handle Zod validation logging safely
function parseWithLogging<T>(schema: any, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    return data as T; 
  }
  return result.data;
}

export function useReadings() {
  return useQuery({
    queryKey: [api.readings.list.path],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}${api.readings.list.path}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch readings");
      const data = await res.json();
      
      return data.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      })) as Reading[];
    },
  });
}

export function useCreateReading() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertReading) => {
      const res = await fetch(`${BASE_URL}${api.readings.create.path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to create reading");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.readings.list.path] });
      toast({
        title: "Reading logged",
        description: "Your blood pressure reading has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

export function useDeleteReading() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.readings.delete.path, { id });
      const res = await fetch(`${BASE_URL}${url}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete reading");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.readings.list.path] });
      toast({
        title: "Reading deleted",
        description: "The reading has been removed from your history.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}