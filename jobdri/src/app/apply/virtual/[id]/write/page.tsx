"use client";

import { use } from "react";
import { Footer } from "@/components/common/footer";
import Header from "@/components/common/header/Header";
import { InputMultiLine1000 } from "@/components/common/input";
import InputSection from "@/components/apply/InputSection";

interface WritePageProps {
  params: Promise<{ id: string }>;
}

export default function WritePage({ params }: WritePageProps) {
  const { id } = use(params);

  return (
    <>
      <Header currentStep={5} />
      <main className="max-w-[1116px] mx-auto flex-1">
        <InputSection />
      </main>
      <Footer
        ctaLabel="제출하기"
        backAction={{ href: `/apply/virtual/${id}/questions` }}
        ctaAction={{ href: `/apply/virtual/${id}/result` }}
      />
    </>
  );
}
