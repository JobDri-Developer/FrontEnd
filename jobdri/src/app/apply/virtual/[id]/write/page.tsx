"use client";

import { Footer } from "@/components/common/footer";
import Header from "@/components/common/header/Header";

interface WritePageProps {
  params: { id: string };
}

export default function WritePage({ params }: WritePageProps) {
  return (
    <>
      <Header currentStep={5} />
      <main className="max-w-[1116px] mx-auto">
        {/* 자소서 입력 UI */}
      </main>
      <Footer
        ctaLabel="제출하기"
        backAction={{ href: `/apply/virtual/${params.id}/questions` }}
        ctaAction={{ href: `/apply/virtual/${params.id}/result` }}
      />
    </>
  );
}
