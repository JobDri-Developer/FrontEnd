"use client";

import { useEffect, type ReactNode } from "react";

interface ModalOverlayProps {
  children: ReactNode;
  onClose?: () => void;
}

export function ModalOverlay({ children, onClose }: ModalOverlayProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div className="relative z-[101]" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
