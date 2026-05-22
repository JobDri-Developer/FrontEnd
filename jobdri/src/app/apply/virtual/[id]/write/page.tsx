import WritePageClient from "./WritePageClient";

interface WritePageProps {
  params: Promise<{ id: string }>;
}

export default async function WritePage({ params }: WritePageProps) {
  const { id } = await params;
  return <WritePageClient id={id} />;
}
