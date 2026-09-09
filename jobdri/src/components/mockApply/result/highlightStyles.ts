export type HighlightStatus = "proven" | "mentioned" | "fabricated";

export const HighlightStyles: Record<
  HighlightStatus,
  { default: string; hover: string; selected: string }
> = {
  proven: {
    default:
      "text-text-highlight-proven bg-fill-highlight-proven-default hover:bg-fill-highlight-proven-hover cursor-pointer transition-colors rounded-none",
    hover:
      "text-text-highlight-proven bg-fill-highlight-proven-hover cursor-pointer transition-colors rounded-none",
    selected:
      "text-text-highlight-proven bg-fill-highlight-proven-hover underline underline-offset-4 cursor-pointer transition-colors rounded-none",
  },
  mentioned: {
    default:
      "text-text-highlight-mentioned bg-fill-highlight-mentioned-default hover:bg-fill-highlight-mentioned-hover cursor-pointer transition-colors rounded-none",
    hover:
      "text-text-highlight-mentioned bg-fill-highlight-mentioned-hover cursor-pointer transition-colors rounded-none",
    selected:
      "text-text-highlight-mentioned bg-fill-highlight-mentioned-hover underline underline-offset-4 cursor-pointer transition-colors rounded-none",
  },
  fabricated: {
    default:
      "text-text-highlight-fabricated bg-fill-highlight-fabricated-default hover:bg-fill-highlight-fabricated-hover cursor-pointer transition-colors rounded-none",
    hover:
      "text-text-highlight-fabricated bg-fill-highlight-fabricated-hover cursor-pointer transition-colors rounded-none",
    selected:
      "text-text-highlight-fabricated bg-fill-highlight-fabricated-hover underline underline-offset-4 cursor-pointer transition-colors rounded-none",
  },
};
