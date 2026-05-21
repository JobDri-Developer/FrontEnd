"use client";

import { useState } from "react";
import Header from "@/components/common/header/Header";
import { Footer } from "@/components/common/footer";
import SelectQuestion from "@/components/apply/SelectQuestion";

export default function MockApplicationQuestionsPage() {
  const [selectedCount, setSelectedCount] = useState(0);

  return (
    <div className="min-h-screen bg-line-neutral-assistive px-6 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] w-[1280px] flex-col">
        <Header currentStep={4} />

        <section className="flex flex-1 flex-col bg-bg-default px-[82px] pt-8 pb-12">
          <SelectQuestion onSelectionChange={setSelectedCount} />
        </section>

        <Footer
          ctaLabel="확정하기"
          backAction={{ href: "/mock-application/jd-review" }}
          ctaAction={{
            disabled: selectedCount === 0,
          }}
        />
      </div>
    </div>
  );
}
