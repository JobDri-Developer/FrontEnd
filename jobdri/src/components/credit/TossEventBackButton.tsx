"use client";

import { useRouter } from "next/navigation";
import { TextButton } from "@/components/common/buttons";
import { ROUTES } from "@/constants/routes";

// 토스 이벤트 페이지에서 유일하게 상호작용이 필요한 부분이라 클라이언트 컴포넌트로 분리
export default function TossEventBackButton() {
  const router = useRouter();

  return (
    <TextButton
      label="뒤로가기"
      size="large"
      styleType="secondary"
      iconPosition="left"
      onClick={() => router.push(ROUTES.CREDIT)}
    />
  );
}
