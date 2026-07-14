export function EmptyApplicationState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 self-stretch py-10">
      <p className="text-center text-t20-semibold text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
        {title}
      </p>
      <p className="text-center text-b16-reg text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
        {description}
      </p>
    </div>
  );
}
