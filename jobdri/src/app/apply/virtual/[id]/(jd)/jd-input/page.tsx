"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/common/footer";
import JdInputPageClient, {
  type JdInputPageClientHandle,
} from "./JdInputPageClient";

type JdInputMethod = "text" | "link" | "image" | "manual";

export default function MockApplicationJdInputPage() {
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
        backAction={{ onClick: () => router.push("/apply") }}
        ctaAction={{
          label: "선택하기",
          disabled: selectedMethod === null,
          onClick: () => clientRef.current?.handleCtaClick(),
        }}
      />
    </div>
  );
}
