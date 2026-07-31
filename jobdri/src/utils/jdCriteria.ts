const CRITERIA_HEADING_PATTERN =
  String.raw`(?:[A-Z][A-Za-z0-9/&+().-]*|[가-힣]+)(?:\s+[가-힣A-Za-z0-9/&+().-]+){0,4}`;

export function normalizeJdLineBreaks(value: string) {
  const normalizedLineBreaks = value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\\u(?:000a|000d|0085|2028|2029)/gi, "\n")
    .replace(/\\r\\n|\\n|\\r/g, "\n")
    .replace(/\r\n?|\v|\f|\u0085|\u2028|\u2029/g, "\n");

  const missingLineBreakBoundary = new RegExp(
    String.raw`(경험|분|자|사람|가능|보유|이상|있음|필수|우대|완료|수료|졸업)\s+(?=${CRITERIA_HEADING_PATTERN}:\s*)`,
    "g",
  );

  return normalizedLineBreaks
    .split("\n")
    .map((line) => line.replace(missingLineBreakBoundary, "$1\n"))
    .join("\n");
}
