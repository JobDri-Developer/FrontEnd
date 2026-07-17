import Icon from "@/components/common/icons/Icon";
import clsx from "clsx";

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
  const hasTitle = !!data.title && data.title.trim() !== "";

  return (
    <div
      onClick={onClick}
      className={`
        group 
        flex flex-row gap-3 p-4 rounded-card-s w-full border transition-colors duration-200
        cursor-pointer select-none
        ${
          isActive
            ? "border-line-primary-default bg-fill-primary-assistive hover:shadow-chip"
            : "border-line-neutral-default bg-fill-quaternary-default hover:border-transparent hover:shadow-chip"
        }
      `}
    >
      <div className="flex items-center gap-3">
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
        <span
          className={clsx(
            "flex-1 text-cap12-semibold text-left line-clamp-2",
            hasTitle ? "text-text-neutral-title" : "text-text-neutral-disabled",
          )}
        >
          {hasTitle ? data.title : "새로운 문항"}
        </span>

        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(data.id);
            }}
            className={`
              relative z-10 
              flex items-center justify-center shrink-0 w-8 h-8 
              opacity-0 group-hover:opacity-100 transition-opacity duration-200 
              cursor-pointer bg-transparent
            `}
          >
            <span
              className="pointer-events-none w-full h-full flex items-center justify-center"
              style={{ pointerEvents: "none" }}
            >
              <Icon type="TRASH" className="text-text-system-fail" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
