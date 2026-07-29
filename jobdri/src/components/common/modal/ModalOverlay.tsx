"use client";

import { useEffect, type ReactNode } from "react";

interface ModalOverlayProps {
  children: ReactNode;
  onClose?: () => void;
}

export function ModalOverlay({ children, onClose }: ModalOverlayProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-lightbox-default transition-opacity"
      onClick={onClose}
    >
      <div className="relative z-[101]" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
