export type HighlightStatus = "proven" | "mentioned" | "fabricated";

export const HighlightStyles: Record<
  HighlightStatus,
  { default: string; hover: string; selected: string }
> = {
  proven: {
    default:
      "py-0.25 text-text-highlight-proven bg-fill-highlight-proven-default hover:bg-fill-highlight-proven-default cursor-pointer transition-colors rounded-sm",
    hover:
      "py-0.25 text-text-highlight-proven bg-fill-highlight-proven-default cursor-pointer transition-colors rounded-sm",
    selected:
      "py-0.25 text-text-highlight-proven bg-fill-highlight-proven-default underline underline-offset-4 cursor-pointer transition-colors rounded-sm",
  },
  mentioned: {
    default:
      "py-0.25 text-text-highlight-mentioned bg-fill-highlight-mentioned-default hover:bg-fill-highlight-mentioned-hover cursor-pointer transition-colors rounded-sm",
    hover:
      "py-0.25 text-text-highlight-mentioned bg-fill-highlight-mentioned-hover cursor-pointer transition-colors rounded-sm",
    selected:
      "py-0.25 text-text-highlight-mentioned bg-fill-highlight-mentioned-hover underline underline-offset-4 cursor-pointer transition-colors rounded-sm",
  },
  fabricated: {
    default:
      "py-0.25 text-text-highlight-fabricated bg-fill-highlight-fabricated-default hover:bg-fill-highlight-fabricated-hover cursor-pointer transition-colors rounded-sm",
    hover:
      "py-0.25 text-text-highlight-fabricated bg-fill-highlight-fabricated-hover cursor-pointer transition-colors rounded-sm",
    selected:
      "py-0.25 text-text-highlight-fabricated bg-fill-highlight-fabricated-hover underline underline-offset-4 cursor-pointer transition-colors rounded-sm",
  },
};
