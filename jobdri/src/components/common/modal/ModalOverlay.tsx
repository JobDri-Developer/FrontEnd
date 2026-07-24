"use client";

import { useEffect, type ReactNode } from "react";

interface ModalOverlayProps {
  children: ReactNode;
}

export function ModalOverlay({ children }: ModalOverlayProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="relative z-[101]" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
