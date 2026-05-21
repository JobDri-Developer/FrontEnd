"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/common/footer";
import SelectQuestion, { type Question } from "@/components/apply/SelectQuestion";
import Header from "@/components/common/header/Header";

interface QuestionsPageProps {
  params: Promise<{ id: string }>;
}

export default function QuestionsPage({ params }: QuestionsPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

  const handleConfirm = () => {
    sessionStorage.setItem(
      "selectedQuestions",
      JSON.stringify(selectedQuestions),
    );
    router.push(`/apply/virtual/${id}/write`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg-default">
      <Header currentStep={4} />
      <main className="mx-auto w-full max-w-[1116px] flex-1">
        <SelectQuestion
          onSelectionChange={() => undefined}
          onQuestionsChange={setSelectedQuestions}
        />
      </main>
      <Footer
        ctaLabel="확정하기"
        backAction={{ href: `/apply/virtual/${id}/jd-review` }}
        ctaAction={{
          disabled: selectedQuestions.length === 0,
          onClick: handleConfirm,
        }}
      />
    </div>
  );
}
