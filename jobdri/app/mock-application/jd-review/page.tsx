import JdReviewPageClient from "./JdReviewPageClient";
import { emptyJdSections } from "@/components/mock-application/jdReviewSections";

interface MockApplicationJdReviewPageProps {
  searchParams?: Promise<{
    mode?: string | string[];
  }>;
}

export default async function MockApplicationJdReviewPage({
  searchParams,
}: MockApplicationJdReviewPageProps) {
  const params = await searchParams;
  const mode = Array.isArray(params?.mode) ? params.mode[0] : params?.mode;

  return (
    <JdReviewPageClient
      sections={mode === "manual" ? emptyJdSections : undefined}
    />
  );
}
