"use client";

import Icon from "@/components/common/icons/Icon";

interface AlretProps {
  score: number;
}

export default function Alret({ score }: AlretProps) {
  const isWarning = score < 60;

  return (
    <div className="flex flex-col items-start gap-1">
      {isWarning ? (
        <Icon type="WARN" />
      ) : (
        <Icon type="CHECK_M" className=" text-icon-primary-default" />
      )}
      <p className="text-t20-semibold">
        {isWarning ? "보완이 필요해요." : "좀 더 개선할 수 있어요."}
      </p>
    </div>
  );
}
