"use client";

import { use, useState } from "react";
import { Footer } from "@/components/common/footer";
import SelectQuestion from "@/components/apply/SelectQuestion";
import Header from "@/components/common/header/Header";

interface QuestionsPageProps {
  params: Promise<{ id: string }>;
}

export default function QuestionsPage({ params }: QuestionsPageProps) {
  const { id } = use(params);
  const [selectedCount, setSelectedCount] = useState(0);

  return (
    <>
      <Header currentStep={4} />
      <SelectQuestion onSelectionChange={setSelectedCount} />
      <Footer
        ctaLabel="확정하기"
        backAction={{ href: `/apply/virtual/${id}/jd` }}
        ctaAction={{
          disabled: selectedCount === 0,
          href: `/apply/virtual/${id}/write`,
        }}
      />
    </>
  );
}
