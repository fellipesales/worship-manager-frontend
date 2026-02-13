"use client";
import { use } from "react";
import { useSchedule, useConfirmSchedule, useNotifySchedule } from "@/lib/hooks/use-schedules";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageLoading } from "@/components/shared/loading";
import { formatDateLong } from "@/lib/utils/format";
import { CheckCircle, Bell, ArrowLeft, Music } from "lucide-react";
import Link from "next/link";

export default function ScheduleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const scheduleId = parseInt(id);
  const { data: schedule, isLoading } = useSchedule(scheduleId);
  const confirmSchedule = useConfirmSchedule();
  const notifySchedule = useNotifySchedule();

  if (isLoading) return <PageLoading />;
  if (!schedule) return <p className="text-center py-8 text-muted-foreground">Escala nao encontrada.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/schedules">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{schedule.serviceType}</h1>
          <p className="text-muted-foreground">{formatDateLong(schedule.date)}</p>
        </div>
        <Badge variant={schedule.status === "Confirmed" ? "default" : "secondary"}>
          {schedule.status === "Draft" ? "Rascunho" : schedule.status === "Confirmed" ? "Confirmada" : schedule.status}
        </Badge>
      </div>

      {schedule.status === "Draft" && (
        <div className="flex gap-2">
          <Button onClick={() => confirmSchedule.mutate(scheduleId)} disabled={confirmSchedule.isPending}>
            <CheckCircle className="h-4 w-4 mr-2" /> Confirmar Escala
          </Button>
        </div>
      )}

      {schedule.status === "Confirmed" && (
        <Button variant="outline" onClick={() => notifySchedule.mutate(scheduleId)} disabled={notifySchedule.isPending}>
          <Bell className="h-4 w-4 mr-2" /> Notificar Membros
        </Button>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Membros Escalados</CardTitle>
        </CardHeader>
        <CardContent>
          {!schedule.scheduleMembers?.length ? (
            <p className="text-sm text-muted-foreground">Nenhum membro escalado.</p>
          ) : (
            <div className="space-y-2">
              {schedule.scheduleMembers.map((sm) => (
                <div key={sm.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
                  <div>
                    <p className="font-medium">{sm.member?.name}</p>
                    {sm.role && <p className="text-sm text-muted-foreground">{sm.role}</p>}
                  </div>
                  <Badge variant={sm.confirmed ? "default" : "outline"}>
                    {sm.confirmed ? "Confirmado" : "Pendente"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {schedule.scheduleSongs?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Repertorio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {schedule.scheduleSongs.map((ss, i) => (
                <div key={ss.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-accent">
                  <span className="text-sm text-muted-foreground w-6">{i + 1}.</span>
                  <Music className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{ss.song?.title}</p>
                    {ss.customKey && <p className="text-sm text-muted-foreground">Tom: {ss.customKey}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
