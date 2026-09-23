// Tema visual "Feed 3" — origem: protótipo Claude Design de 02/09/2026
// (E:\meu2cerebro\1-Projetos\Strivo\Feed 3 e Stores - design concluido (2026-09-02).md)

export const colors = {
  bg: "#0B100D",
  surface: "#15170F",
  surfaceAlt: "#1E221D",
  border: "#262626",
  divider: "#1a1a1a",

  accent: "#39FF14",
  accentSoft: "#9FE870",

  text: "#F5F5F5",
  textStrong: "#FFFFFF",
  prose: "#DDE3DB",
  textMuted: "#8B9489",
  textDim: "#7c877d",

  danger: "#FF4D67",

  bubbleIn: "#15170F",
  bubbleOut: "#1c3d18",
  bubbleOutText: "#EFFFE9",
};

export const radii = {
  sm: 9,
  md: 12,
  lg: 14,
  xl: 16,
  pill: 999,
};

// Space Grotesk (títulos) não está empacotado no app — usamos o peso 700 do
// sistema como aproximação pra não adicionar uma dependência de fonte só
// por isso. Ver decisão registrada na sessão de 19/09/2026.
export const displayFont = {
  fontWeight: "700" as const,
  letterSpacing: -0.3,
};
