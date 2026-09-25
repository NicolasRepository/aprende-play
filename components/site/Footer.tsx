import Link from 'next/link';
import Image from 'next/image'; 
import logo from '@/components/site/logo.png';

export function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image
            src={logo}
            alt="AprendePlay"
            className="h-10 w-10 object-contain"
            priority
            />
            <span className="text-lg font-bold text-gray-900">
              Aprende<span className="text-brand-500">Play</span>
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/sobre" className="hover:text-brand-600 transition-colors">
              Sobre
            </Link>
            <Link href="/dashboard" className="hover:text-brand-600 transition-colors">
              Jogos
            </Link>
            <span className="text-gray-400">© 2026 Aprende Play</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
