"use client";

import Header from "@/components/common/header/Header";
import ApplyResult from "@/components/apply/result/ApplyResult";

interface ResultPageClientProps {
  id: string;
}

export default function ResultPageClient({ id }: ResultPageClientProps) {
  return (
    <div className="flex min-h-screen flex-col bg-bg-default">
      <Header currentStep={6} />
      <main className="mx-auto w-full max-w-[1116px] flex-1">
        <ApplyResult applyId={Number(id)} />
      </main>
    </div>
  );
}
