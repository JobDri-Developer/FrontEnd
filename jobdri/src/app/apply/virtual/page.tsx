"use client";

import { useState } from "react";
import { Footer } from "@/common/footer";
import SelectQuestion from "@/components/apply/SelectQuestion";
import Header from "@/components/common/header/Header";

export default function VirtualApplyPage() {
  const [selectedCount, setSelectedCount] = useState(0);

  return (
    <>
      <Header />
      <SelectQuestion onSelectionChange={setSelectedCount} />
      <Footer
        ctaLabel="확정하기"
        ctaAction={{ disabled: selectedCount === 0 }}
      />
    </>
  );
}
