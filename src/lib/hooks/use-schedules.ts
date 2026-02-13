"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { schedulesApi } from "@/lib/api/schedules";
import type { Schedule } from "@/lib/types";

export function useSchedules() {
  return useQuery({ queryKey: ["schedules"], queryFn: schedulesApi.getAll });
}

export function useSchedule(id: number) {
  return useQuery({ queryKey: ["schedules", id], queryFn: () => schedulesApi.getById(id), enabled: !!id });
}

export function useUpcomingSchedules() {
  return useQuery({ queryKey: ["schedules", "upcoming"], queryFn: schedulesApi.getUpcoming });
}

export function useCreateSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Schedule>) => schedulesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["schedules"] }),
  });
}

export function useGenerateSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { date: string; serviceType: string }) => schedulesApi.generate(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["schedules"] }),
  });
}

export function useConfirmSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => schedulesApi.confirm(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["schedules"] }),
  });
}

export function useNotifySchedule() {
  return useMutation({ mutationFn: (id: number) => schedulesApi.notify(id) });
}
