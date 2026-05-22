"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/common/footer";
import Header from "@/components/common/header/Header";
import { ModalNotice } from "@/components/common/modal";
import InputSection, {
  type InputSectionHandle,
} from "@/components/apply/InputSection";

interface WritePageClientProps {
  id: string;
}

export default function WritePageClient({ id }: WritePageClientProps) {
  const router = useRouter();
  const inputRef = useRef<InputSectionHandle>(null);
  const [allComplete, setAllComplete] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = () => {
    if (inputRef.current?.hasUnderThreshold()) {
      setShowModal(true);
      return;
    }

    router.push(`/apply/virtual/${id}/result`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg-default">
      <Header currentStep={5} />
      <main className="mx-auto w-full max-w-[1116px] flex-1">
        <InputSection
          ref={inputRef}
          applyId={Number(id)}
          onAllCompleteChange={setAllComplete}
        />
      </main>
      <Footer
        ctaLabel="제출하기"
        backAction={{ href: `/apply/virtual/${id}/questions` }}
        ctaAction={{
          disabled: !allComplete,
          onClick: handleSubmit,
        }}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-lightbox-default">
          <ModalNotice
            variant="double"
            title="글자 수가 부족합니다."
            description={
              "글자 수가 부족하면 채점 결과에\n부정적인 영향을 줄 수 있습니다."
            }
            onClose={() => setShowModal(false)}
            secondaryAction={{
              label: "계속 작성하기",
              onClick: () => setShowModal(false),
            }}
            primaryAction={{
              label: "확정하기",
              onClick: () => router.push(`/apply/virtual/${id}/result`),
            }}
          />
        </div>
      )}
    </div>
  );
}
