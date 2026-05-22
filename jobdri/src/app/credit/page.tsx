import { Suspense } from "react";
import CreditPageClient from "./CreditPageClient";

export default function CreditPage() {
  return (
    <Suspense>
      <CreditPageClient />
    </Suspense>
  );
}
