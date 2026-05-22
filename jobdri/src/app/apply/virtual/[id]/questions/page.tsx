import QuestionsPageClient from "./QuestionsPageClient";

interface QuestionsPageProps {
  params: Promise<{ id: string }>;
}

export default async function QuestionsPage({ params }: QuestionsPageProps) {
  const { id } = await params;
  return <QuestionsPageClient id={id} />;
}
