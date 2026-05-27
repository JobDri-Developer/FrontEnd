import { Suspense } from "react";
import WritePageClient from "./WritePageClient";

interface WritePageProps {
  params: Promise<{ id: string }>;
}

export default async function WritePage({ params }: WritePageProps) {
  const { id } = await params;
  return (
    <Suspense>
      <WritePageClient id={id} />
    </Suspense>
  );
}
