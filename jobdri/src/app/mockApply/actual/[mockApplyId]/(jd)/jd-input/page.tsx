"use client";

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Footer } from "@/components/common/footer";
import JdInputPageClient, {
  type JdInputPageClientHandle,
} from "./JdInputPageClient";

type JdInputMethod = "link" | "image" | "manual";

export default function MockApplicationJdInputPage() {
  const { mockApplyId: id } = useParams<{ mockApplyId: string }>();
  const router = useRouter();
  const clientRef = useRef<JdInputPageClientHandle>(null);
  const [selectedMethod, setSelectedMethod] = useState<JdInputMethod | null>(
    null,
  );

  return (
    <div className="min-h-screen flex flex-col bg-bg-default">
      <JdInputPageClient
        ref={clientRef}
        selectedMethod={selectedMethod}
        onMethodChange={setSelectedMethod}
      />
      <Footer
        backAction={{ onClick: () => router.push("/mockApply") }}
        ctaAction={{
          label: "선택하기",
          disabled: selectedMethod === null,
          onClick: () => clientRef.current?.handleCtaClick(),
        }}
      />
    </div>
  );
}
