import { Suspense } from "react";
import WritePageClient from "./WritePageClient";

interface WritePageProps {
  params: Promise<{ mockApplyId: string }>;
}

export default async function WritePage({ params }: WritePageProps) {
  const { mockApplyId } = await params;
  return (
    <Suspense>
      <WritePageClient id={mockApplyId} />
    </Suspense>
  );
}
