"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membersApi } from "@/lib/api/members";
import type { Member } from "@/lib/types";

export function useMembers() {
  return useQuery({ queryKey: ["members"], queryFn: membersApi.getAll });
}

export function useActiveMembers() {
  return useQuery({ queryKey: ["members", "active"], queryFn: membersApi.getActive });
}

export function useMember(id: number) {
  return useQuery({ queryKey: ["members", id], queryFn: () => membersApi.getById(id), enabled: !!id });
}

export function useCreateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Member>) => membersApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });
}

export function useUpdateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Member> }) => membersApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });
}

export function useDeleteMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => membersApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });
}
