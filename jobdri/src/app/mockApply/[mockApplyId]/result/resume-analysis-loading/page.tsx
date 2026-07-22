import ResumeAnalysisLoadingPageClient from "./ResumeAnalysisLoadingPageClient";
import { formatApplicationSequenceLabel } from "@/lib/mockApply/applicationLabel";

interface ResumeAnalysisLoadingPageProps {
  searchParams: Promise<{
    sequence?: string;
  }>;
}

function parsePositiveNumber(value?: string) {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) && parsedValue > 0
    ? parsedValue
    : undefined;
}

export default async function ResumeAnalysisLoadingPage({
  searchParams,
}: ResumeAnalysisLoadingPageProps) {
  const { sequence } = await searchParams;
  const parsedSequence = parsePositiveNumber(sequence);

  return (
    <ResumeAnalysisLoadingPageClient
      initialSequence={parsedSequence}
      applicationLabel={formatApplicationSequenceLabel(parsedSequence)}
    />
  );
}
