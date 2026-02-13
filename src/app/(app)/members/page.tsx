"use client";
import { useState } from "react";
import { useMembers, useCreateMember, useUpdateMember, useDeleteMember } from "@/lib/hooks/use-members";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageLoading } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { Users, Plus, Search, Pencil, Trash2, X } from "lucide-react";
import type { Member } from "@/lib/types";

export default function MembersPage() {
  const { data: members, isLoading } = useMembers();
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState({ name: "", instrument: "", phone: "", email: "" });

  const filtered = members?.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.instrument?.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setEditing(null);
    setForm({ name: "", instrument: "", phone: "", email: "" });
    setShowForm(true);
  }

  function openEdit(member: Member) {
    setEditing(member);
    setForm({ name: member.name, instrument: member.instrument || "", phone: member.phone, email: member.email || "" });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await updateMember.mutateAsync({ id: editing.id, data: form });
    } else {
      await createMember.mutateAsync(form);
    }
    setShowForm(false);
  }

  if (isLoading) return <PageLoading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Membros</h1>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Novo Membro
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por nome ou instrumento..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {showForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{editing ? "Editar Membro" : "Novo Membro"}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Instrumento</Label>
                <Input value={form.instrument} onChange={(e) => setForm({ ...form, instrument: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" disabled={createMember.isPending || updateMember.isPending}>
                  {editing ? "Salvar" : "Criar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!filtered?.length ? (
        <EmptyState icon={Users} title="Nenhum membro" description="Adicione membros para comecar a gerenciar escalas." action={<Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> Adicionar Membro</Button>} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    {member.instrument && <Badge variant="secondary" className="mt-1">{member.instrument}</Badge>}
                    {member.phone && <p className="text-sm text-muted-foreground mt-1">{member.phone}</p>}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(member)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMember.mutate(member.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>{member.participationCount} participacoes</span>
                  {!member.isActive && <Badge variant="destructive">Inativo</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
