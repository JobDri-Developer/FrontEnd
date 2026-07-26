import ResumeAnalysisLoadingPageClient from "./ResumeAnalysisLoadingPageClient";
import { formatApplicationSequenceLabel } from "@/lib/mockApply/applicationLabel";

interface ResumeAnalysisLoadingPageProps {
  searchParams: Promise<{
    taskId?: string;
    jobPostingId?: string;
    sequence?: string;
    error?: string;
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
  const { taskId, jobPostingId, sequence, error } = await searchParams;
  const parsedJobPostingId = parsePositiveNumber(jobPostingId);
  const parsedSequence = parsePositiveNumber(sequence);

  return (
    <ResumeAnalysisLoadingPageClient
      taskId={taskId?.trim()}
      jobPostingId={parsedJobPostingId}
      initialSequence={parsedSequence}
      applicationLabel={formatApplicationSequenceLabel(parsedSequence)}
      isError={error === "true"}
    />
  );
}
