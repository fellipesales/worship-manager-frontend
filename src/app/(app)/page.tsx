"use client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageLoading } from "@/components/shared/loading";
import { reportsApi } from "@/lib/api/reports";
import { schedulesApi } from "@/lib/api/schedules";
import { formatDate } from "@/lib/utils/format";
import { Users, Calendar, CalendarCheck, Music } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: dashboard, isLoading: loadingDash } = useQuery({
    queryKey: ["dashboard"],
    queryFn: reportsApi.getDashboard,
  });
  const { data: upcoming, isLoading: loadingUpcoming } = useQuery({
    queryKey: ["schedules", "upcoming"],
    queryFn: schedulesApi.getUpcoming,
  });

  if (loadingDash) return <PageLoading />;

  const stats = [
    { label: "Membros Ativos", value: dashboard?.activeMembers ?? 0, icon: Users, color: "text-blue-600" },
    { label: "Total de Escalas", value: dashboard?.totalSchedules ?? 0, icon: Calendar, color: "text-green-600" },
    { label: "Proximas Escalas", value: dashboard?.upcomingSchedules ?? 0, icon: CalendarCheck, color: "text-purple-600" },
    { label: "Total de Membros", value: dashboard?.totalMembers ?? 0, icon: Music, color: "text-orange-600" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Proximas Escalas</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingUpcoming ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : !upcoming?.length ? (
            <p className="text-sm text-muted-foreground">Nenhuma escala proxima.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.slice(0, 5).map((schedule: { id: number; date: string; serviceType: string; status: string; scheduleMembers?: { id: number }[] }) => (
                <Link key={schedule.id} href={`/schedules/${schedule.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                  <div>
                    <p className="font-medium">{schedule.serviceType}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(schedule.date)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={schedule.status === "Confirmed" ? "default" : "secondary"}>
                      {schedule.status === "Draft" ? "Rascunho" : schedule.status === "Confirmed" ? "Confirmada" : schedule.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{schedule.scheduleMembers?.length ?? 0} membros</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
