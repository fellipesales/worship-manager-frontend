"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { organizationsApi } from "@/lib/api/organizations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageLoading } from "@/components/shared/loading";
import { Building2, Copy, RefreshCw, Loader2, Trash2 } from "lucide-react";

export default function OrganizationPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: org, isLoading } = useQuery({
    queryKey: ["organization", "current"],
    queryFn: organizationsApi.getCurrent,
  });

  const { data: members } = useQuery({
    queryKey: ["organization", "members", org?.id],
    queryFn: () => organizationsApi.getMembers(org!.id),
    enabled: !!org?.id,
  });

  const regenerateInvite = useMutation({
    mutationFn: () => organizationsApi.regenerateInvite(org!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["organization"] }),
  });

  const removeMember = useMutation({
    mutationFn: (userId: string) => organizationsApi.removeMember(org!.id, userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["organization", "members"] }),
  });

  const [copied, setCopied] = useState(false);

  function copyInviteCode() {
    if (org?.inviteCode) {
      navigator.clipboard.writeText(org.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (isLoading) return <PageLoading />;
  if (!org) return <p className="text-center py-8 text-muted-foreground">Nenhuma organizacao encontrada.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Organizacao</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{org.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Slug</Label>
              <p className="font-medium">{org.slug}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Status</Label>
              <p><Badge variant={org.isActive ? "default" : "destructive"}>{org.isActive ? "Ativo" : "Inativo"}</Badge></p>
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground">Codigo de Convite</Label>
            <div className="flex items-center gap-2 mt-1">
              <code className="bg-muted px-3 py-2 rounded-md text-lg font-mono tracking-wider">{org.inviteCode}</code>
              <Button variant="outline" size="icon" onClick={copyInviteCode}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => regenerateInvite.mutate()} disabled={regenerateInvite.isPending}>
                {regenerateInvite.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
              {copied && <span className="text-sm text-green-600">Copiado!</span>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Membros da Organizacao</CardTitle>
        </CardHeader>
        <CardContent>
          {!members?.length ? (
            <p className="text-sm text-muted-foreground">Nenhum membro encontrado.</p>
          ) : (
            <div className="space-y-2">
              {members.map((m: { userId: string; fullName?: string; email?: string; roles?: string[]; createdAt: string }) => (
                <div key={m.userId} className="flex items-center justify-between p-3 rounded-md hover:bg-accent">
                  <div>
                    <p className="font-medium">{m.fullName || m.email}</p>
                    {m.email && <p className="text-sm text-muted-foreground">{m.email}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {m.roles?.map((r: string) => <Badge key={r} variant="secondary">{r}</Badge>)}
                    {m.userId !== session?.user?.id && (
                      <Button variant="ghost" size="icon" onClick={() => removeMember.mutate(m.userId)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
