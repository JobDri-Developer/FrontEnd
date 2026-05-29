import { Suspense } from "react";
import ResultPageClient from "./ResultPageClient";

interface ResultPageProps {
  params: Promise<{ jobPostingId: string }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { jobPostingId } = await params;
  return (
    <Suspense>
      <ResultPageClient id={jobPostingId} />
    </Suspense>
  );
}
