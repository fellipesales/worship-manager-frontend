"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { songsApi } from "@/lib/api/songs";
import type { Song } from "@/lib/types";

export function useSongs() {
  return useQuery({ queryKey: ["songs"], queryFn: songsApi.getAll });
}

export function useActiveSongs() {
  return useQuery({ queryKey: ["songs", "active"], queryFn: songsApi.getActive });
}

export function useSong(id: number) {
  return useQuery({ queryKey: ["songs", id], queryFn: () => songsApi.getById(id), enabled: !!id });
}

export function useCreateSong() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Song>) => songsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["songs"] }),
  });
}

export function useUpdateSong() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Song> }) => songsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["songs"] }),
  });
}

export function useDeleteSong() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => songsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["songs"] }),
  });
}
