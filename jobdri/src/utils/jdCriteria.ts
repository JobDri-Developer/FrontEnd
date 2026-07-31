const HEADING_PATTERN =
  String.raw`(?:[A-Z][A-Za-z0-9/&+().-]*|[가-힣]+)(?:\s+[가-힣A-Za-z0-9/&+().-]+){0,4}`;

const ABBREVIATION_PERIOD_PLACEHOLDER = "\uE000";
const COMMON_ABBREVIATIONS =
  /\b(?:e\.g|i\.e|U\.S|U\.K|Mr|Mrs|Ms|Dr|Prof|Jr|Sr|vs|No)\./gi;

function protectAbbreviationPeriods(value: string) {
  return value.replace(COMMON_ABBREVIATIONS, (abbreviation) =>
    abbreviation.replaceAll(".", ABBREVIATION_PERIOD_PLACEHOLDER),
  );
}

function restoreAbbreviationPeriods(value: string) {
  return value.replaceAll(ABBREVIATION_PERIOD_PLACEHOLDER, ".");
}

function removeItemMarker(value: string) {
  return value
    .replace(
      /^(?:[-–—*•●◦▪▫■□◆◇▶▷▸▹‣⁃·ㆍ]|\(?\d{1,2}\)|\d{1,2}[.)]|[①-⑳]|[가-하][.)])\s*/,
      "",
    )
    .trim();
}

export function normalizeCriteriaList(value: string) {
  const headingBoundary = new RegExp(
    String.raw`[,;；|｜]\s+(?=${HEADING_PATTERN}:\s*)`,
    "g",
  );
  const unpunctuatedHeadingBoundary = new RegExp(
    String.raw`(경험|분|자|사람|가능|보유|이상|있음|필수|우대|완료|수료|졸업)\s+(?=${HEADING_PATTERN}:\s*)`,
    "g",
  );

  const normalized = protectAbbreviationPeriods(value)
    // API나 에디터에 따라 달라지는 줄바꿈 표현을 먼저 통일합니다.
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\\r\\n|\\n|\\r/g, "\n")
    .replace(/\r\n?|\u0085|\u2028|\u2029/g, "\n")
    // 한 줄 안에 이어 붙은 불릿과 번호 목록을 분리합니다.
    .replace(
      /(?:^|[ \t])(?:[-–—*•●◦▪▫■□◆◇▶▷▸▹‣⁃·ㆍ]|\(?\d{1,2}\)|\d{1,2}[.)]|[①-⑳]|[가-하][.)])\s+(?=\S)/gm,
      "\n",
    )
    // 목록 구분자로 자주 사용되는 세미콜론과 파이프를 분리합니다.
    .replace(/\s*[;；|｜]\s*(?=\S)/g, "\n")
    // "고용형태: ..., 근무기간: ..." 같은 필드형 목록을 분리합니다.
    .replace(headingBoundary, "\n")
    // 마침표, 물음표, 느낌표로 끝나는 한글/영문 문장을 분리합니다.
    .replace(/([.!?。！？](?:["')\]]?))\s+(?=[A-Z0-9가-힣])/g, "$1\n")
    // 마침표 없이 "… 경험 MLOps 경험: …"처럼 합쳐진 항목을 분리합니다.
    .replace(unpunctuatedHeadingBoundary, "$1\n");

  return restoreAbbreviationPeriods(normalized)
    .split(/\n+/)
    .map(removeItemMarker)
    .filter(Boolean)
    .join("\n");
}
