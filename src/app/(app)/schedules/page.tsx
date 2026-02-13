"use client";
import { useState } from "react";
import { useSchedules, useGenerateSchedule } from "@/lib/hooks/use-schedules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageLoading } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { Calendar, Plus, Sparkles, X } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import Link from "next/link";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  Draft: { label: "Rascunho", variant: "secondary" },
  Confirmed: { label: "Confirmada", variant: "default" },
  Completed: { label: "Concluida", variant: "secondary" },
  Cancelled: { label: "Cancelada", variant: "destructive" },
};

export default function SchedulesPage() {
  const { data: schedules, isLoading } = useSchedules();
  const generateSchedule = useGenerateSchedule();
  const [showGenerate, setShowGenerate] = useState(false);
  const [genForm, setGenForm] = useState({ date: "", serviceType: "" });

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    await generateSchedule.mutateAsync(genForm);
    setShowGenerate(false);
    setGenForm({ date: "", serviceType: "" });
  }

  if (isLoading) return <PageLoading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Escalas</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowGenerate(!showGenerate)}>
            <Sparkles className="h-4 w-4 mr-2" /> Gerar com IA
          </Button>
          <Link href="/schedules/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Nova Escala
            </Button>
          </Link>
        </div>
      </div>

      {showGenerate && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Gerar Escala Automatica</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowGenerate(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2">
                <Label>Data</Label>
                <Input type="date" value={genForm.date} onChange={(e) => setGenForm({ ...genForm, date: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Culto</Label>
                <Input placeholder="Ex: Culto Domingo Manha" value={genForm.serviceType} onChange={(e) => setGenForm({ ...genForm, serviceType: e.target.value })} required />
              </div>
              <Button type="submit" disabled={generateSchedule.isPending}>
                <Sparkles className="h-4 w-4 mr-2" /> Gerar
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {!schedules?.length ? (
        <EmptyState icon={Calendar} title="Nenhuma escala" description="Crie ou gere escalas automaticamente." />
      ) : (
        <div className="space-y-3">
          {schedules.map((schedule) => {
            const status = statusMap[schedule.status] || { label: schedule.status, variant: "secondary" as const };
            return (
              <Link key={schedule.id} href={`/schedules/${schedule.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{schedule.serviceType}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(schedule.date)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{schedule.scheduleMembers?.length ?? 0} membros</span>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
