import Icon from "@/components/common/icons/Icon";

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
  onDelete?: (id: number) => void;
}

export const QuestionItem = ({
  index,
  data,
  isActive,
  onClick,
  onDelete,
}: QuestionItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`
        group 
        flex flex-row gap-3 p-4 rounded-card-s w-full border cursor-pointer transition-colors duration-200
        ${
          isActive
            ? "border-line-primary-default bg-fill-primary-assistive  hover:shadow-chip"
            : "border-line-neutral-default bg-fill-quaternary-default hover:border-none hover:shadow-chip"
        }
      `}
    >
      <div className="flex items-center gap-3">
        {/* 번호 인디케이터 */}
        <div
          className={`
          flex items-center justify-center w-8 h-8 rounded-toast-s text-btn16-semibold shrink-0
          ${isActive ? "bg-fill-primary-default text-text-neutral-white" : "bg-icon-neutral-weak text-text-neutral-description"}
        `}
        >
          {index + 1}
        </div>
      </div>

      <div className="flex-1 flex flex-row min-w-0 items-center justify-between gap-2 min-h-[32px]">
        {data.content ? (
          <p className="flex-1 text-cap12-semibold text-left text-text-neutral-title line-clamp-2">
            {data.content}
          </p>
        ) : (
          <span className="flex-1 text-cap12-semibold text-left text-text-neutral-disabled line-clamp-2">
            {data.title}
          </span>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(data.id);
            }}
            className="hidden group-hover:flex items-center justify-center shrink-0"
          >
            <Icon type="TRASH" className="text-text-system-fail" />
          </button>
        )}
      </div>
    </div>
  );
};
