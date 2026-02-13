"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "@/lib/api/reports";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoading } from "@/components/shared/loading";
import { BarChart3, Download, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { format, subMonths } from "date-fns";

const COLORS = ["#7c3aed", "#2563eb", "#059669", "#d97706", "#dc2626", "#0891b2", "#6366f1", "#84cc16"];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    start: format(subMonths(new Date(), 3), "yyyy-MM-dd"),
    end: format(new Date(), "yyyy-MM-dd"),
  });

  const { data: participation, isLoading: loadingPart } = useQuery({
    queryKey: ["reports", "participation", dateRange],
    queryFn: () => reportsApi.getParticipation(dateRange.start, dateRange.end),
  });

  const { data: instruments, isLoading: loadingInst } = useQuery({
    queryKey: ["reports", "instruments"],
    queryFn: reportsApi.getInstrumentStats,
  });

  async function exportPdf() {
    const blob = await reportsApi.exportPdf(dateRange.start, dateRange.end);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-${dateRange.start}-${dateRange.end}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function exportExcel() {
    const blob = await reportsApi.exportExcel(dateRange.start, dateRange.end);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-${dateRange.start}-${dateRange.end}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Relatorios</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportPdf}><FileText className="h-4 w-4 mr-2" /> PDF</Button>
          <Button variant="outline" onClick={exportExcel}><Download className="h-4 w-4 mr-2" /> Excel</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-2">
          <Label>Data Inicio</Label>
          <Input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Data Fim</Label>
          <Input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Participacao por Membro</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingPart ? (
              <p className="text-sm text-muted-foreground">Carregando...</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={participation}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(262.1, 83.3%, 57.8%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuicao por Instrumento</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingInst ? (
              <p className="text-sm text-muted-foreground">Carregando...</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={instruments} dataKey="count" nameKey="instrument" cx="50%" cy="50%" outerRadius={100} label>
                    {instruments?.map((_: unknown, index: number) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
