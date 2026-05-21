"use client";

import { use } from "react";
import Header from "@/components/common/header/Header";

interface ResultPageProps {
  params: Promise<{ id: string }>;
}

export default function ResultPage({ params }: ResultPageProps) {
  const { id } = use(params);

  return (
    <>
      <Header currentStep={6} />
      <main className="max-w-[1116px] mx-auto">
        {/* 채점 결과 UI */}
      </main>
    </>
  );
}
