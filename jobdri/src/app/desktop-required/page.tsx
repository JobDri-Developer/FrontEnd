import LogoVerticalM from "@/components/common/logo/vertical/m";

export default function DesktopRequiredPage() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-bg-default px-5 py-10">
      <section className="flex w-full max-w-[440px] flex-col items-center rounded-card-l bg-bg-contents-default px-6 py-10 text-center shadow-modal">
        <LogoVerticalM className="mb-10" />

        <div className="flex flex-col items-center gap-3">
          <h1 className="text-t20-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
            데스크탑에서 이용해주세요
          </h1>
          <p className="text-sub14-med break-keep text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
            로그인 및 회원가입이 완료되었어요.
            <br />
            나머지 기능은 데스크탑 환경에서 확인해주세요.
          </p>
        </div>
      </section>
    </main>
  );
}
