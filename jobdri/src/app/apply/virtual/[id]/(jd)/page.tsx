"use client";

import { use } from "react";
import { Footer } from "@/components/common/footer";
import Header from "@/components/common/header/Header";

interface JdPageProps {
  params: Promise<{ id: string }>;
}

export default function JdPage({ params }: JdPageProps) {
  const { id } = use(params);

  return (
    <>
      <Header currentStep={2} />
      <main className="max-w-[1116px] mx-auto">
        {/* JD 입력 UI */}
      </main>
      <Footer
        ctaLabel="다음"
        backAction={{ href: "/apply" }}
        ctaAction={{ href: `/apply/virtual/${id}/questions` }}
      />
    </>
  );
}
