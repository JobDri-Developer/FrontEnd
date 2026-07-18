import ResumeAnalysisFeedback from "@/components/mockApply/ResumeAnalysisFeedback";

interface ResumeAnalysisFeedbackPageProps {
  searchParams: Promise<{
    mockApplyId?: string;
    sequence?: string;
  }>;
}

function parsePositiveNumber(value?: string) {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) && parsedValue > 0
    ? parsedValue
    : undefined;
}

export default async function ResumeAnalysisFeedbackPage({
  searchParams,
}: ResumeAnalysisFeedbackPageProps) {
  const { mockApplyId, sequence } = await searchParams;

  return (
    <ResumeAnalysisFeedback
      mockApplyId={parsePositiveNumber(mockApplyId)}
      sequence={parsePositiveNumber(sequence)}
    />
  );
}
