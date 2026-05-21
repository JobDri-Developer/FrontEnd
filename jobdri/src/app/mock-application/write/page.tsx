"use client";

import Header from "@/components/common/header/Header";
import { Footer } from "@/components/common/footer";
import InputSection from "@/components/apply/InputSection";

export default function MockApplicationWritePage() {
  return (
    <div className="min-h-screen bg-line-neutral-assistive px-6 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] w-[1280px] flex-col">
        <Header currentStep={5} />

        <section className="flex flex-1 flex-col items-center bg-bg-default px-[82px] pt-8 pb-12">
          <InputSection />
        </section>

        <Footer
          ctaLabel="제출하기"
          backAction={{ href: "/mock-application/questions" }}
        />
      </div>
    </div>
  );
}
