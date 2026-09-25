'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Section {
  id: string;
  label: string;
}

interface Props {
  sections: Section[];
}

export function ScrollSpySidebar({ sections }: Props) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-4">
      {sections.map((s) => (
        <button key={s.id} onClick={() => scrollTo(s.id)} className="group flex items-center gap-3" aria-label={s.label}>
          <span
            className={cn(
              'text-xs font-semibold whitespace-nowrap opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0',
              active === s.id ? 'text-brand-600' : 'text-gray-500'
            )}
          >
            {s.label}
          </span>
          <span
            className={cn(
              'h-2.5 w-2.5 rounded-full border-2 transition-all',
              active === s.id
                ? 'bg-brand-500 border-brand-500 scale-125'
                : 'bg-white border-brand-200 group-hover:border-brand-400'
            )}
          />
        </button>
      ))}
    </div>
  );
}
