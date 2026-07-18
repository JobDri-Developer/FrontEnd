const KOREAN_SEQUENCE_LABELS = [
  "첫",
  "두",
  "세",
  "네",
  "다섯",
  "여섯",
  "일곱",
  "여덟",
  "아홉",
  "열",
];

export function formatApplicationSequenceLabel(sequence?: number) {
  if (!sequence || !Number.isFinite(sequence) || sequence < 1) {
    return undefined;
  }

  const sequenceLabel =
    KOREAN_SEQUENCE_LABELS[sequence - 1] ?? String(sequence);

  return `${sequenceLabel} 번째 지원`;
}
