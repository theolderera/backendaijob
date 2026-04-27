/**
 * Profanity list for filtering offensive language in Tajik, Russian, and English.
 * This is used to maintain a professional environment on the platform.
 */
export const PROFANITY_PATTERNS = [
  // English (Standard \b works here)
  /\b(fuck|shit|bitch|asshole|dick|pussy|bastard|cunt)\b/i,
  
  // Russian & Tajik (Using custom boundaries because \b doesn't work with Cyrillic/Unicode)
  // Pattern: (?:^|[^а-яёҷғҳқӣӯ])(WORD)(?=[^а-яёҷғҳқӣӯ]|$)
  
  // Russian
  /(?:^|[^а-яё])(хуй|пизд|бля|сука|еба|ёба|гондон|уеб|муда|пидор|пидар|курва)(?=[^а-яё]|$)/ui,
  /(?:^|[^а-яё])(хули|нах|пох)(?=[^а-яё]|$)/ui,
  
  // Tajik
  /(?:^|[^а-яёҷғҳқӣӯ])(кӯс|кус|кур|гои|гоя|гом|мур|лаънат|ланат|ҳаром|харом|занакбаз|саг)(?=[^а-яёҷғҳқӣӯ]|$)/ui,
  /(?:^|[^а-яёҷғҳқӣӯ])(гоида|падар|оча|очат|аҷал|лаънати)(?=[^а-яёҷғҳқӣӯ]|$)/ui,
  /ҳаромхӯр/ui,
  /керам/ui,
  /кери/ui,
];

/**
 * Checks if the given text contains any profanity.
 * @param text The text to check
 * @returns boolean
 */
export function hasProfanity(text: string): boolean {
  // Normalize text to handle variations
  const normalized = text.toLowerCase();
  return PROFANITY_PATTERNS.some(pattern => pattern.test(normalized));
}
