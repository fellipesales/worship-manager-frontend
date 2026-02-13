"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Users,
  Calendar,
  CalendarCheck,
  Music,
  BarChart3,
  Settings,
  Building2,
} from "lucide-react";

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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50">
      <div className="flex flex-col flex-grow border-r bg-card pt-5 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-6">
          <Music className="h-8 w-8 text-primary mr-2" />
          <span className="text-xl font-bold">Worship Manager</span>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
