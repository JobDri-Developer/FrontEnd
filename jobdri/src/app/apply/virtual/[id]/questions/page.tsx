"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/common/footer";
import SelectQuestion from "@/components/apply/SelectQuestion";
import Header from "@/components/common/header/Header";

interface Question {
  id: string;
  question: string;
  maxLength?: number;
}

interface QuestionsPageProps {
  params: Promise<{ id: string }>;
}

export default function QuestionsPage({ params }: QuestionsPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

  const handleConfirm = () => {
    sessionStorage.setItem("selectedQuestions", JSON.stringify(selectedQuestions));
    router.push(`/apply/virtual/${id}/write`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-default">
      <Header currentStep={4} />
      <main className="flex-1 max-w-[1116px] w-full mx-auto">
        <SelectQuestion
          onSelectionChange={() => {}}
          onQuestionsChange={setSelectedQuestions}
        />
      </main>
      <Footer
        ctaLabel="확정하기"
        backAction={{ href: `/apply/virtual/${id}/jd` }}
        ctaAction={{
          disabled: selectedQuestions.length === 0,
          onClick: handleConfirm,
        }}
      />
    </div>
  );
}
