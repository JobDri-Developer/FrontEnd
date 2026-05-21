import JdInputPageClient from "./JdInputPageClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MockApplicationJdInputPage({ params }: Props) {
  const { id } = await params;
  return <JdInputPageClient id={id} />;
}
