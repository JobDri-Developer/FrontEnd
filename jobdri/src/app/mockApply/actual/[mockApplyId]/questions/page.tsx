import QuestionsPageClient from "./QuestionsPageClient";

interface QuestionsPageProps {
  params: Promise<{ mockApplyId: string }>;
}

export default async function QuestionsPage({ params }: QuestionsPageProps) {
  const { mockApplyId } = await params;
  return <QuestionsPageClient id={mockApplyId} />;
}
