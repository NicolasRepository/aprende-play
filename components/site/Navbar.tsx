'use client';

import Link from 'next/link';
import Image from 'next/image'; 
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import logo from '@/components/site/logo.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Navbar() {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Verificações de permissão
  const isAdmin = profile?.role === 'usuario_admin';
  const isAutorizado = profile?.role === 'usuario_autorizado' || isAdmin; // Admin também é considerado autorizado

  // Links dinâmicos baseados na permissão
  const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/dashboard', label: 'Jogos' },
    { href: '/sobre', label: 'Sobre' },
    // Mostra "Criar Conteúdo" se for autorizado ou admin
    ...(isAutorizado ? [{ href: '/conteudo', label: 'Criar Conteúdo' }] : []),
    // Mostra "Administração" apenas se for admin
    ...(isAdmin ? [{ href: '/admin', label: 'Administração' }] : []),
  ];

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : profile?.email?.[0]?.toUpperCase() ?? 'U';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-100 bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logo}
            alt="AprendePlay"
            className="h-10 w-10 object-contain"
            priority
          />
          <span className="text-xl font-bold text-gray-900 hidden sm:block">
            Aprende<span className="text-brand-500">Play</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-gray-600 hover:text-brand-600 hover:bg-brand-50'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth area */}
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-brand-50 transition-colors">
                  <Avatar className="h-9 w-9 border-2 border-brand-200">
                    <AvatarFallback className="bg-brand-100 text-brand-700 font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {profile?.full_name?.split(' ')[0] ?? 'Minha Conta'}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-semibold">{profile?.full_name ?? 'Usuário'}</p>
                  <p className="text-xs text-gray-500">{profile?.email}</p>
                  <p className="text-xs mt-1">
                    <span className="inline-flex items-center rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                      {/* Ajuste visual na badge do perfil, se quiser exibir "Admin" */}
                      {isAdmin ? 'Administrador' : isAutorizado ? 'Autorizado' : 'Usuário'}
                    </span>
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Meus Jogos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/perfil">Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-brand-600 hover:bg-brand-50">
                  Entrar
                </Button>
              </Link>
              <Link href="/cadastro">
                <Button size="sm" className="bg-brand-500 hover:bg-brand-600 text-white">
                  Cadastrar
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-brand-50"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-brand-100 bg-white px-4 py-3 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'block px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-gray-600 hover:text-brand-600 hover:bg-brand-50'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
