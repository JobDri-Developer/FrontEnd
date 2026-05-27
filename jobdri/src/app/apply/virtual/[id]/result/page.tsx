import { Suspense } from "react";
import ResultPageClient from "./ResultPageClient";

interface ResultPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { id } = await params;
  return (
    <Suspense>
      <ResultPageClient id={id} />
    </Suspense>
  );
}
