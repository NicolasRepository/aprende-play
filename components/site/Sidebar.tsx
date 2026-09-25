'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { isAdmin, isAuthorized } from '@/lib/types';
import { cn } from '@/lib/utils';
import logo from '@/components/site/logo.png';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  LayoutDashboard,
  PlusCircle,
  ShieldCheck,
  LogOut,
  Menu,
  Home,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

function useSidebarLinks(): NavItem[] {
  const { profile } = useAuth();
  const links: NavItem[] = [{ href: '/dashboard', label: 'Jogos', icon: LayoutDashboard }];

  if (isAuthorized(profile?.role)) {
    links.push({ href: '/conteudo', label: 'Criar Conteúdo', icon: PlusCircle });
  }
  if (isAdmin(profile?.role)) {
    links.push({ href: '/admin', label: 'Administração', icon: ShieldCheck });
  }

  return links;
}

function SidebarLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const links = useSidebarLinks();

  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const Icon = link.icon;
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-brand-50 text-brand-600'
                : 'text-gray-600 hover:bg-brand-50 hover:text-brand-600'
            )}
          >
            <Icon className="h-4.5 w-4.5" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const { profile, signOut } = useAuth();

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : profile?.email?.[0]?.toUpperCase() ?? 'U';

  const handleExit = async () => {
    onNavigate?.();
    router.push('/');
  };

  const handleSignOut = async () => {
    onNavigate?.();
    await signOut();
    router.push('/');
  };

  return (
    <div className="mt-auto flex flex-col gap-3 border-t border-brand-100 pt-4">
      <button
        onClick={handleExit}
        className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-brand-50 hover:text-brand-600 transition-colors"
      >
        <Home className="h-4.5 w-4.5" />
        Voltar ao Site
      </button>

      <div className="flex items-center gap-3 rounded-xl px-4 py-2">
        <Avatar className="h-9 w-9 border-2 border-brand-200 shrink-0">
          <AvatarFallback className="bg-brand-100 text-brand-700 font-semibold text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-800">
            {profile?.full_name ?? 'Usuário'}
          </p>
          <p className="truncate text-xs text-gray-400">{profile?.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          aria-label="Sair"
          className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:left-0 border-r border-brand-100 bg-white px-4 py-6">
      <Link href="/" className="flex items-center gap-2 px-2 mb-8">
        <Image src={logo} alt="AprendePlay" className="h-9 w-9 object-contain" />
        <span className="text-lg font-bold text-gray-900">
          Aprende<span className="text-brand-500">Play</span>
        </span>
      </Link>

      <SidebarLinks />
      <SidebarFooter />
    </aside>
  );
}

export function MobileSidebarBar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden sticky top-0 z-40 flex items-center justify-between border-b border-brand-100 bg-white/95 backdrop-blur-sm px-4 py-3">
      <Link href="/" className="flex items-center gap-2">
        <Image src={logo} alt="AprendePlay" className="h-8 w-8 object-contain" />
        <span className="text-base font-bold text-gray-900">
          Aprende<span className="text-brand-500">Play</span>
        </span>
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button aria-label="Menu" className="rounded-lg p-2 hover:bg-brand-50">
            <Menu className="h-5 w-5 text-brand-600" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col w-64 px-4 py-6">
          <SidebarLinks onNavigate={() => setOpen(false)} />
          <SidebarFooter onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
