const scrollbarBase =
  "[&::-webkit-scrollbar-track]:bg-transparent " +
  "[&::-webkit-scrollbar-thumb]:bg-icon-neutral-weak " +
  "[&::-webkit-scrollbar-thumb]:rounded-full " +
  "[&::-webkit-scrollbar-thumb]:border-solid " +
  "[&::-webkit-scrollbar-thumb]:border-transparent " +
  "[&::-webkit-scrollbar-thumb]:bg-clip-padding " +
  "[&::-webkit-scrollbar-track]:![margin-block:4px] ";

// 텍스트 인풋 등 넓은 영역에 사용
export const scrollbarClassL =
  scrollbarBase +
  "[&::-webkit-scrollbar]:w-4 [&::-webkit-scrollbar]:h-4 " + // 전체 너비 16px
  "[&::-webkit-scrollbar-thumb]:border-[4px]"; // 상하좌우 4px 투명 여백 (실제 보이는 두께 8px)

// 리스트 내부, 드롭다운 등 좁은 영역에 사용
export const scrollbarClassS =
  scrollbarBase +
  "[&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar]:h-3 " + // 전체 너비 12px
  "[&::-webkit-scrollbar-thumb]:border-[4px]"; // 상하좌우 4px 투명 여백 (실제 보이는 두께 4px)
