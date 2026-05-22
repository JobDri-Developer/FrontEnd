import { Suspense } from "react";
import OAuthRedirectClient from "./OAuthRedirectClient";

function OAuthRedirectFallback() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-bg-default px-4">
      <section className="flex w-[440px] max-w-full flex-col items-center gap-6 rounded-card bg-bg-contents-default p-10 shadow-[0_0_24px_0_var(--color-bg-shadow-default)]">
        <h1 className="text-center text-[32px] leading-[130%] font-bold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
          JobDri
        </h1>
        <p className="text-sub14-med text-center text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
          Google 로그인 처리 중입니다.
        </p>
      </section>
    </main>
  );
}

export default function OAuthRedirectPage() {
  return (
    <Suspense fallback={<OAuthRedirectFallback />}>
      <OAuthRedirectClient />
    </Suspense>
  );
}
