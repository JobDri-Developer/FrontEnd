export interface QuestionData {
  id: number;
  title: string;
  content?: string;
}

interface QuestionItemProps {
  index: number;
  data: QuestionData;
  isActive: boolean;
  onClick: () => void;
}

export const QuestionItem = ({
  index,
  data,
  isActive,
  onClick,
}: QuestionItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`
        flex flex-row gap-3 p-4 rounded-card-s w-64 border cursor-pointer transition-colors duration-200
        ${
          isActive
            ? "border-line-primary-default bg-fill-primary-assistive"
            : "border-line-neutral-default bg-fill-quaternary-default hover:border-line-primary-default"
        }
      `}
    >
      <div className="flex items-center gap-3">
        {/* 번호 인디케이터 */}
        <div
          className={`
          flex items-center justify-center w-8 h-8 rounded-toast-s text-btn16-semibold
          ${isActive ? "bg-fill-primary-default text-text-neutral-white" : "bg-icon-neutral-weak text-text-neutral-description"}
        `}
        >
          {index + 1}
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center min-h-[32px]">
        {data.content ? (
          <>
            <p className="text-cap12-semibold text-text-neutral-title truncate ">
              {data.content}
            </p>
            <span className="text-cap12-med text-text-neutral-description mt-0.5">
              {data.content.length} / 1,000자
            </span>
          </>
        ) : (
          <span className="text-cap12-semibold text-text-neutral-disabled">
            {data.title}
          </span>
        )}
      </div>
    </div>
  );
};
