"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { X, LayoutDashboard, Users, Calendar, CalendarCheck, Music, BarChart3, Settings, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/members", label: "Membros", icon: Users },
  { href: "/schedules", label: "Escalas", icon: Calendar },
  { href: "/availability", label: "Disponibilidade", icon: CalendarCheck },
  { href: "/repertoire", label: "Repertorio", icon: Music },
  { href: "/reports", label: "Relatorios", icon: BarChart3 },
  { href: "/settings", label: "Configuracoes", icon: Settings },
  { href: "/organization", label: "Organizacao", icon: Building2 },
];

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 w-72 bg-card shadow-lg p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Music className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold">Worship Manager</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
