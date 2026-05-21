"use client";

import { use } from "react";
import Header from "@/components/common/header/Header";

interface ResultPageProps {
  params: Promise<{ id: string }>;
}

export default function ResultPage({ params }: ResultPageProps) {
  const { id } = use(params);

  return (
    <div className="min-h-screen flex flex-col bg-bg-default">
      <Header currentStep={6} />
      <main className="flex-1 max-w-[1116px] w-full mx-auto">
        {/* 채점 결과 UI */}
      </main>
    </div>
  );
}
