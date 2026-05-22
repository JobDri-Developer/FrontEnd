"use client";

import Header from "@/components/common/header/Header";
import ApplyResult from "@/components/apply/result/ApplyResult";

interface ResultPageClientProps {
  id: string;
}

export default function ResultPageClient({ id }: ResultPageClientProps) {
  return (
    <div className="flex h-screen flex-col bg-bg-default">
      <Header currentStep={6} />
      <main className="mx-auto w-full flex-1 flex flex-col overflow-hidden">
        <ApplyResult applyId={Number(id)} />
      </main>
    </div>
  );
}
