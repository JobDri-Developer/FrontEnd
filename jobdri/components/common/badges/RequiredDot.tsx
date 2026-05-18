interface RequiredDotProps {
  label?: string;
}

export function RequiredDot({ label = "필수 항목" }: RequiredDotProps) {
  return (
    <span
      aria-label={label}
      role="img"
      className="block h-[5px] min-h-[5px] w-[5px] min-w-[5px] shrink-0 rounded-[5px] border border-[#FF4242] bg-[#FF4545] box-border"
    />
  );
}
