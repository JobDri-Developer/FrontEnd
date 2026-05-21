"use client";

import { use, useState } from "react";
import { Footer } from "@/components/common/footer";
import SelectQuestion, { type Question } from "@/components/apply/SelectQuestion";
import Header from "@/components/common/header/Header";

interface QuestionsPageProps {
  params: Promise<{ id: string }>;
}

export default function QuestionsPage({ params }: QuestionsPageProps) {
  const { id } = use(params);
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

  const saveSelectedQuestions = () => {
    sessionStorage.setItem("selectedQuestions", JSON.stringify(selectedQuestions));
  };

  return (
    <>
      <Header currentStep={4} />
      <SelectQuestion
        onSelectionChange={setSelectedCount}
        onQuestionsChange={setSelectedQuestions}
      />
      <Footer
        ctaLabel="확정하기"
        backAction={{ href: `/apply/virtual/${id}/jd` }}
        ctaAction={{
          disabled: selectedCount === 0,
          onClick: saveSelectedQuestions,
          href: `/apply/virtual/${id}/write`,
        }}
      />
    </>
  );
}
