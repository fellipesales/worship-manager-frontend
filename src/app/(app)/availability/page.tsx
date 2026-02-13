"use client";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActiveMembers } from "@/lib/hooks/use-members";
import { availabilityApi } from "@/lib/api/availability";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoading } from "@/components/shared/loading";
import { CalendarCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils/cn";
import type { Member, Availability } from "@/lib/types";

export default function AvailabilityPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const { data: members, isLoading: loadingMembers } = useActiveMembers();
  const queryClient = useQueryClient();

  const start = format(startOfMonth(currentMonth), "yyyy-MM-dd");
  const end = format(endOfMonth(currentMonth), "yyyy-MM-dd");

  const { data: availabilities } = useQuery({
    queryKey: ["availability", selectedMember, start, end],
    queryFn: () => availabilityApi.getByDateRange(selectedMember!, start, end),
    enabled: !!selectedMember,
  });

  const setAvailability = useMutation({
    mutationFn: availabilityApi.set,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["availability"] }),
  });

  const days = useMemo(() => eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) }), [currentMonth]);

  const availMap = useMemo(() => {
    const map = new Map<string, boolean>();
    availabilities?.forEach((a: Availability) => map.set(a.date.split("T")[0], a.isAvailable));
    return map;
  }, [availabilities]);

  function toggleDay(date: Date) {
    if (!selectedMember) return;
    const dateStr = format(date, "yyyy-MM-dd");
    const current = availMap.get(dateStr);
    setAvailability.mutate({
      memberId: selectedMember,
      date: dateStr,
      isAvailable: current === undefined ? true : !current,
    });
  }

  if (loadingMembers) return <PageLoading />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Disponibilidade</h1>

      <div className="flex flex-wrap gap-2">
        {members?.map((m: Member) => (
          <Button
            key={m.id}
            variant={selectedMember === m.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedMember(m.id)}
          >
            {m.name}
          </Button>
        ))}
      </div>

      {selectedMember && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-lg capitalize">{format(currentMonth, "MMMM yyyy", { locale: ptBR })}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((d) => (
                <div key={d} className="text-xs font-medium text-muted-foreground py-2">{d}</div>
              ))}
              {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {days.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const status = availMap.get(dateStr);
                return (
                  <button
                    key={dateStr}
                    onClick={() => toggleDay(day)}
                    className={cn(
                      "aspect-square rounded-md text-sm flex items-center justify-center transition-colors",
                      status === true && "bg-green-100 text-green-800 hover:bg-green-200",
                      status === false && "bg-red-100 text-red-800 hover:bg-red-200",
                      status === undefined && "hover:bg-accent"
                    )}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-100 rounded" /> Disponivel</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-100 rounded" /> Indisponivel</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-accent rounded" /> Nao informado</div>
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedMember && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CalendarCheck className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Selecione um membro para gerenciar a disponibilidade.</p>
        </div>
      )}
    </div>
  );
}
