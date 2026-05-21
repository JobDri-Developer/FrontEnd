import JdReviewPageClient from "./JdReviewPageClient";
import { emptyJdSections } from "@/components/mock-application/jdReviewSections";

interface Props {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ mode?: string | string[] }>;
}

export default async function MockApplicationJdReviewPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const mode = Array.isArray(sp?.mode) ? sp.mode[0] : sp?.mode;

  return (
    <JdReviewPageClient
      id={id}
      sections={mode === "manual" ? emptyJdSections : undefined}
    />
  );
}
