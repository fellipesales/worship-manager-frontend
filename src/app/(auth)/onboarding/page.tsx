"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Building2, UserPlus, Loader2 } from "lucide-react";
import { organizationsApi } from "@/lib/api/organizations";

export default function OnboardingPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"choose" | "create" | "join">("choose");
  const [orgName, setOrgName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    setLoading(true);
    setError("");
    try {
      await organizationsApi.create({ name: orgName });
      router.push("/");
    } catch {
      setError("Erro ao criar organizacao.");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    setLoading(true);
    setError("");
    try {
      await organizationsApi.join(inviteCode);
      router.push("/");
    } catch {
      setError("Codigo de convite invalido.");
    } finally {
      setLoading(false);
    }
  }

  if (mode === "choose") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Music className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Bem-vindo!</CardTitle>
          <CardDescription>Como deseja comecar?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full h-auto p-4 justify-start" onClick={() => setMode("create")}>
            <Building2 className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Criar Organizacao</div>
              <div className="text-xs text-muted-foreground">Crie uma nova igreja ou ministerio</div>
            </div>
          </Button>
          <Button variant="outline" className="w-full h-auto p-4 justify-start" onClick={() => setMode("join")}>
            <UserPlus className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Entrar com Convite</div>
              <div className="text-xs text-muted-foreground">Tenho um codigo de convite</div>
            </div>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>{mode === "create" ? "Criar Organizacao" : "Entrar com Convite"}</CardTitle>
        <CardDescription>
          {mode === "create" ? "Informe o nome da sua igreja ou ministerio" : "Digite o codigo de convite"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}
        {mode === "create" ? (
          <div className="space-y-2">
            <Label>Nome da Organizacao</Label>
            <Input placeholder="Ex: Igreja Lago Escala" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
          </div>
        ) : (
          <div className="space-y-2">
            <Label>Codigo de Convite</Label>
            <Input placeholder="Ex: ABC123" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} />
          </div>
        )}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setMode("choose")} className="flex-1">
            Voltar
          </Button>
          <Button
            onClick={mode === "create" ? handleCreate : handleJoin}
            disabled={loading || (mode === "create" ? !orgName : !inviteCode)}
            className="flex-1"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {mode === "create" ? "Criar" : "Entrar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
