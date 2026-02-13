"use client";
import { useState } from "react";
import { useSongs, useCreateSong, useUpdateSong, useDeleteSong } from "@/lib/hooks/use-songs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageLoading } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { Music, Plus, Search, Pencil, Trash2, X, ExternalLink } from "lucide-react";
import type { Song } from "@/lib/types";

export default function RepertoirePage() {
  const { data: songs, isLoading } = useSongs();
  const createSong = useCreateSong();
  const updateSong = useUpdateSong();
  const deleteSong = useDeleteSong();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Song | null>(null);
  const [form, setForm] = useState({ title: "", artist: "", key: "", category: "", spotifyUrl: "", youTubeUrl: "" });

  const filtered = songs?.filter(
    (s) => s.title.toLowerCase().includes(search.toLowerCase()) || s.artist?.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setEditing(null);
    setForm({ title: "", artist: "", key: "", category: "", spotifyUrl: "", youTubeUrl: "" });
    setShowForm(true);
  }

  function openEdit(song: Song) {
    setEditing(song);
    setForm({
      title: song.title,
      artist: song.artist || "",
      key: song.key || "",
      category: song.category || "",
      spotifyUrl: song.spotifyUrl || "",
      youTubeUrl: song.youTubeUrl || "",
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await updateSong.mutateAsync({ id: editing.id, data: form });
    } else {
      await createSong.mutateAsync(form);
    }
    setShowForm(false);
  }

  if (isLoading) return <PageLoading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Repertorio</h1>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Nova Musica
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por titulo ou artista..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {showForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{editing ? "Editar Musica" : "Nova Musica"}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Titulo</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Artista</Label>
                <Input value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Tom</Label>
                <Input placeholder="Ex: G, Am, D" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Input placeholder="Ex: Adoracao, Louvor" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Spotify URL</Label>
                <Input value={form.spotifyUrl} onChange={(e) => setForm({ ...form, spotifyUrl: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>YouTube URL</Label>
                <Input value={form.youTubeUrl} onChange={(e) => setForm({ ...form, youTubeUrl: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" disabled={createSong.isPending || updateSong.isPending}>
                  {editing ? "Salvar" : "Criar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!filtered?.length ? (
        <EmptyState icon={Music} title="Nenhuma musica" description="Adicione musicas ao repertorio." action={<Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> Adicionar Musica</Button>} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((song) => (
            <Card key={song.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{song.title}</p>
                    {song.artist && <p className="text-sm text-muted-foreground">{song.artist}</p>}
                    <div className="flex gap-1 mt-1">
                      {song.key && <Badge variant="outline">{song.key}</Badge>}
                      {song.category && <Badge variant="secondary">{song.category}</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(song)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteSong.mutate(song.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  {song.spotifyUrl && <a href={song.spotifyUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 flex items-center gap-1"><ExternalLink className="h-3 w-3" />Spotify</a>}
                  {song.youTubeUrl && <a href={song.youTubeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-red-600 flex items-center gap-1"><ExternalLink className="h-3 w-3" />YouTube</a>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
