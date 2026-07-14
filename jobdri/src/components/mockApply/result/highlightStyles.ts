export type HighlightStatus = "proven" | "mentioned" | "fabricated";

export const highlightStyles: Record<
  HighlightStatus,
  { default: string; selected: string }
> = {
  proven: {
    default:
      "py-0.25 text-text-highlight-proven bg-fill-highlight-proven-default hover:bg-fill-highlight-proven-default",
    selected:
      "py-0.25 text-text-highlight-proven bg-fill-highlight-proven-default underline underline-offset-4",
  },
  mentioned: {
    default:
      "py-0.25 text-text-highlight-mentioned bg-fill-highlight-mentioned-default hover:bg-fill-highlight-mentioned-hover",
    selected:
      "py-0.25 text-text-highlight-mentioned bg-fill-highlight-mentioned-hover underline underline-offset-4",
  },
  fabricated: {
    default:
      "py-0.25 text-text-highlight-fabricated bg-fill-highlight-fabricated-default hover:bg-fill-highlight-fabricated-hover",
    selected:
      "py-0.25 text-text-highlight-fabricated bg-fill-highlight-fabricated-hover underline underline-offset-4",
  },
};
