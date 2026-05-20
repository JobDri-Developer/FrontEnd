import type { HTMLAttributes } from "react";
import clsx from "clsx";

export default function BusinessFooter({
  className,
  ...footerProps
}: HTMLAttributes<HTMLElement>) {
  return (
    <footer
      className={clsx("flex self-stretch flex-col", className)}
      {...footerProps}
    >
      <div className="flex items-start justify-between self-stretch bg-bg-default px-10 py-7">
        <div className="mx-auto flex w-full max-w-[1060px] flex-1 items-start gap-3">
          <div className="flex w-[150px] flex-col items-start gap-[34px]">
            <strong className="flex h-6 w-[54.545px] items-center justify-center pr-[2.545px] text-[14px] font-bold leading-[140%] text-text-neutral-title">
              JobDri
            </strong>
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-start gap-6">
            <div className="flex w-full max-w-[405px] flex-col items-start">
              <div className="flex items-center gap-3 self-stretch">
                <span className="text-[11px] font-medium leading-[160%] tracking-[-0.22px] text-gray-400 [font-feature-settings:'liga'_off,'clig'_off]">
                  올데이용
                </span>
                <span className="h-3 w-px bg-line-neutral-strong" />
                <span className="text-[11px] font-medium leading-[160%] tracking-[-0.22px] text-gray-400 [font-feature-settings:'liga'_off,'clig'_off]">
                  대표: 이현주
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 self-stretch">
                <span className="text-[11px] font-medium leading-[160%] tracking-[-0.22px] text-gray-400 [font-feature-settings:'liga'_off,'clig'_off]">
                  사업자등록번호: 758-14-03078
                </span>
                <span className="h-3 w-px bg-line-neutral-strong" />
                <span className="text-[11px] font-medium leading-[160%] tracking-[-0.22px] text-gray-400 [font-feature-settings:'liga'_off,'clig'_off]">
                  통신판매신고번호: 2025-서울서초-2817
                </span>
              </div>
              <p className="self-stretch text-[11px] font-medium leading-[160%] tracking-[-0.22px] text-gray-400 [font-feature-settings:'liga'_off,'clig'_off]">
                서울특별시 서초구 강남대로107길 21, 2층(잠원동, 대능빌딩)
              </p>
              <div className="flex flex-wrap items-center gap-3 self-stretch">
                <span className="text-[11px] font-medium leading-[160%] tracking-[-0.22px] text-gray-400 [font-feature-settings:'liga'_off,'clig'_off]">
                  대표전화: 070-8095-1874
                </span>
                <span className="h-3 w-px bg-line-neutral-strong" />
                <span className="text-[11px] font-medium leading-[160%] tracking-[-0.22px] text-gray-400 [font-feature-settings:'liga'_off,'clig'_off]">
                  이메일: help@allthatityoung.com
                </span>
              </div>
            </div>

            <p className="self-stretch text-[11px] font-medium leading-[160%] tracking-[-0.22px] text-gray-400 [font-feature-settings:'liga'_off,'clig'_off]">
              본 웹사이트에 명시된 모든 기업의 로고 및 상표에 대한 권리는 각 해당
              상표권자에게 귀속됩니다. 해당 로고는 합격자 취업 현황 등 단순 정보
              제공의 목적으로만 사용되며, 상표권 침해 의도는 없습니다.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-14 self-stretch bg-icon-neutral-strong px-10 py-4">
        <div className="mx-auto flex w-full max-w-[1060px] items-center justify-between">
          <p className="text-cap12-med text-gray-400 [font-feature-settings:'liga'_off,'clig'_off]">
            © 2026 잡드리, All rights reserved.
          </p>

          <div className="flex h-4 items-center gap-4">
            <button
              type="button"
              className="flex h-4 items-center text-cap12-med text-gray-400 [font-feature-settings:'liga'_off,'clig'_off]"
            >
              이용 약관
            </button>
            <span className="h-4 w-px bg-[#D3D5D7]" />
            <button
              type="button"
              className="flex h-4 items-center text-cap12-med text-gray-400 [font-feature-settings:'liga'_off,'clig'_off]"
            >
              개인정보 처리방침
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
