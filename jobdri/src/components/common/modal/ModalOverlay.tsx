"use client";

import { useEffect, type ReactNode } from "react";
import clsx from "clsx";

interface ModalOverlayProps {
  children: ReactNode;
  /** Esc 키, 그리고 closeOnBackdropClick이 true일 때 배경 클릭 시 호출됩니다. */
  onClose?: () => void;
  /**
   * 배경 클릭으로 닫을지 여부.
   * ModalNotice처럼 컨텐츠가 스스로 바깥 클릭을 처리하는 경우에는
   * onClose를 넘기지 않아 닫힘 동작을 컨텐츠 쪽에 맡깁니다.
   */
  closeOnBackdropClick?: boolean;
  /** 부모 컨테이너 영역만 덮어야 할 때 "absolute"를 사용합니다. */
  position?: "fixed" | "absolute";
  /** 화면별 스택 순서를 유지해야 할 때 덮어씁니다. */
  zIndexClassName?: string;
  className?: string;
}

export function ModalOverlay({
  children,
  onClose,
  closeOnBackdropClick = true,
  position = "fixed",
  zIndexClassName = "z-[100]",
  className,
}: ModalOverlayProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (!onClose) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick =
    onClose && closeOnBackdropClick ? onClose : undefined;

  return (
    <div
      className={clsx(
        "inset-0 flex items-center justify-center bg-bg-lightbox-default transition-opacity",
        position,
        zIndexClassName,
        className,
      )}
      onClick={handleBackdropClick}
    >
      <div
        className="relative z-[101]"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
