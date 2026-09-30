"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Lnb from "@/components/common/lnb/Lnb";
import { BusinessFooter } from "@/components/common/footer";
import { IconOnlyButton } from "@/components/common/buttons";
import { ROUTES } from "@/constants/routes";
import tossEventMainImage from "@/assets/img_toss_eventpage_1.png";
import tossEventNoticeImage from "@/assets/img_toss_eventpage_2.png";

export default function TossEventPage() {
  const router = useRouter();

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#F5F6F9]">
      <Lnb initialActiveItem={null} className="z-50 shrink-0" />
      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <main className="mx-auto w-full max-w-[1320px] min-w-[1060px] px-18 pt-12 pb-20">
          <div className="flex items-center gap-2">
            <IconOnlyButton
              iconType="ARROW_LEFT_24"
              aria-label="크레딧 페이지로 돌아가기"
              onClick={() => router.push(ROUTES.CREDIT)}
            />
            <h1 className="text-h24-bold text-text-neutral-title">
              토스페이 이벤트
            </h1>
          </div>

          <section className="mx-auto mt-8 flex w-full max-w-[960px] flex-col overflow-hidden rounded-card shadow-card">
            {/* 두 이미지를 같은 배율로 맞추기 위해 1108/1600 비율로 너비 지정 */}
            <div className="flex justify-center bg-[#D6E5FF]">
              <Image
                src={tossEventMainImage}
                alt="토스페이 결제 시 최대 4천원 혜택. EVENT 1: 1원 이상 결제 시 1% 즉시 할인(최대 1,000원). EVENT 2: 1원 이상 생애 첫 결제 시 3천원 즉시 적립(1인 1회). 기간 26.09.28 ~ 26.12.28, 예산 소진 시 조기 종료"
                sizes="665px"
                className="h-auto w-[69.25%]"
                priority
              />
            </div>
            <Image
              src={tossEventNoticeImage}
              alt="토스페이 프로모션 유의사항"
              sizes="960px"
              className="h-auto w-full"
            />
          </section>
        </main>
        <BusinessFooter />
      </div>
    </div>
  );
}
