"use client";

import { usePathname } from "next/navigation";

const routeTitles: Record<string, string> = {
  "/": "홈",
  "/credit": "크레딧",
};

const PageDescriptions: Record<string, string> = {
  "/": "당신의 커리어 여정을 시작하세요",
  "/credit": "원하는 패키지를 시작하세요",
};

export default function PageHeader() {
  const pathname = usePathname();
  const title =
    routeTitles[pathname] ?? pathname.split("/").filter(Boolean).pop() ?? "홈";

  return (
    <div className="flex flex-col items-start gap-2">
      <h1 className="text-h24-bold text-text-neutral-title">{title}</h1>
      <p className="text-b16-med text-text-neutral-description">
        {PageDescriptions[pathname]}
      </p>
    </div>
  );
}
