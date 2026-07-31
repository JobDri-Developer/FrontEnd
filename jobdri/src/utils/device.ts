const DESKTOP_MIN_WIDTH = 1100;

export function shouldShowDesktopRequiredPage() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia(`(max-width: ${DESKTOP_MIN_WIDTH - 1}px)`).matches
  );
}
