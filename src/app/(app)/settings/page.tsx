"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "@/lib/api/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoading } from "@/components/shared/loading";
import { Settings, Save, Loader2 } from "lucide-react";
import type { OrganizationSettings, MessageTemplate } from "@/lib/types";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading: loadingSettings } = useQuery({ queryKey: ["settings"], queryFn: settingsApi.get });
  const { data: templates, isLoading: loadingTemplates } = useQuery({ queryKey: ["templates"], queryFn: settingsApi.getTemplates });

  const [form, setForm] = useState<Partial<OrganizationSettings>>({});

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const updateSettings = useMutation({
    mutationFn: (data: Partial<OrganizationSettings>) => settingsApi.update(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["settings"] }),
  });

  const updateTemplate = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { template: string; isActive?: boolean } }) => settingsApi.updateTemplate(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["templates"] }),
  });

  if (loadingSettings) return <PageLoading />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configuracoes</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Algoritmo de Escalas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>Maximo de Membros por Escala</Label>
              <Input type="number" value={form.maximumMembersPerSchedule ?? ""} onChange={(e) => setForm({ ...form, maximumMembersPerSchedule: parseInt(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Minimo de Membros por Escala</Label>
              <Input type="number" value={form.minimumMembersPerSchedule ?? ""} onChange={(e) => setForm({ ...form, minimumMembersPerSchedule: parseInt(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Dias Minimos entre Participacoes</Label>
              <Input type="number" value={form.minimumDaysBetweenParticipation ?? ""} onChange={(e) => setForm({ ...form, minimumDaysBetweenParticipation: parseInt(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Dias de Antecedencia para Lembrete</Label>
              <Input type="number" value={form.reminderDaysBefore ?? ""} onChange={(e) => setForm({ ...form, reminderDaysBefore: parseInt(e.target.value) })} />
            </div>
            <div className="space-y-2 flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.enableWhatsAppNotifications ?? false}
                  onChange={(e) => setForm({ ...form, enableWhatsAppNotifications: e.target.checked })}
                  className="h-4 w-4 rounded border-input"
                />
                <span className="text-sm">Habilitar WhatsApp</span>
              </label>
            </div>
          </div>
          <Button className="mt-4" onClick={() => updateSettings.mutate(form)} disabled={updateSettings.isPending}>
            {updateSettings.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Salvar Configuracoes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Templates de Mensagem</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingTemplates ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : (
            <div className="space-y-4">
              {templates?.map((t: MessageTemplate) => (
                <div key={t.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{t.name}</p>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={t.isActive}
                        onChange={(e) => updateTemplate.mutate({ id: t.id, data: { template: t.template, isActive: e.target.checked } })}
                        className="h-4 w-4 rounded border-input"
                      />
                      Ativo
                    </label>
                  </div>
                  <textarea
                    className="w-full h-24 text-sm border rounded-md p-2 bg-background"
                    defaultValue={t.template}
                    onBlur={(e) => {
                      if (e.target.value !== t.template) {
                        updateTemplate.mutate({ id: t.id, data: { template: e.target.value } });
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
