export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function normalize(s: string): string {
  return s.trim().toLowerCase();
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function replaceWord(text: string, word: string, replacement: string): string {
  return text.replace(new RegExp(escapeRegExp(word), 'i'), replacement);
}

export function blankOutWord(text: string, word: string | null): string {
  if (!word) return text;
  return replaceWord(text, word, '_____');
}

// completa as opções de uma lacuna usando palavras de outras lacunas da música,
// garantindo diversidade mesmo se o professor cadastrar poucas opções
export function buildGapOptions(word: string, baseOptions: string[], pool: string[], min = 4): string[] {
  const set = new Set<string>([word, ...baseOptions]);
  const extras = shuffle(pool.filter((w) => !set.has(w)));
  while (set.size < min && extras.length) set.add(extras.pop()!);
  return shuffle(Array.from(set));
}

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'á', 'à', 'â', 'ã', 'é', 'ê', 'í', 'ó', 'ô', 'õ', 'ú']);

export function isVowel(char: string): boolean {
  return VOWELS.has(char.toLowerCase());
}

export function isLetter(char: string): boolean {
  return /[a-zà-úA-ZÀ-Ú]/.test(char);
}

export interface MaskedChar {
  char: string;
  hidden: boolean;
}

export function maskWord(
  word: string,
  mode: 'lotoleitura_vogais' | 'lotoleitura_consoantes' | 'lotoleitura_completa'
): MaskedChar[] {
  return word.split('').map((char) => {
    if (!isLetter(char)) return { char, hidden: false };
    if (mode === 'lotoleitura_completa') return { char, hidden: true };
    if (mode === 'lotoleitura_vogais') return { char, hidden: !isVowel(char) };
    return { char, hidden: isVowel(char) };
  });
}
