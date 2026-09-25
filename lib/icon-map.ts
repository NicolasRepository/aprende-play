import { BookOpen, Calculator, FlaskConical, Globe, Landmark, Sparkles } from 'lucide-react';

const ICON_MAP: Record<string, typeof BookOpen> = {
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Landmark,
  Sparkles,
};

export function resolveIcon(name?: string | null) {
  return (name && ICON_MAP[name]) || BookOpen;
}
