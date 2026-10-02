"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Lnb from "@/components/common/lnb/Lnb";
import { TextButton } from "@/components/common/buttons";
import { ROUTES } from "@/constants/routes";
import tossEventImage from "@/assets/img_toss_eventpage.png";

const NOTICE_SECTIONS = [
  {
    title: "[생애 첫 결제 프로모션 유의사항]",
    items: [
      "본 쿠폰 패키지는 일부 가맹점에서 사용이 제한될 수 있으며, 가맹점에서 결제 이력이 없는 경우에만 적용되어요. (토스 ID당 1회)",
      "토스 결제 화면에서 생애 첫 결제 혜택이 보이지 않을 경우 대상이 아니에요.",
      "결제를 취소하면 지급된 토스포인트가 회수돼요.",
      "적립은 1원 단위로 받을 수 있어요.",
    ],
  },
  {
    title: "[일반 프로모션 유의사항]",
    items: [
      "환불은 할인을 적용한 후 실제 결제한 금액만큼 받을 수 있어요.",
      "할인 받은 결제를 부분 취소할 경우, 부분 취소 비율만큼 혜택이 줄어들어 최종 환불 금액이 정해져요.",
      "할인을 적용 가능 횟수만큼 모두 받았더라도, 이미 할인 받은 결제내역을 전액 취소하면 그만큼 다시 받을 수 있어요. 단, 이전 결제가 제대로 취소되지 않으면 할인 받을 수 없어요.",
    ],
  },
  {
    title: "[공통 프로모션 유의사항]",
    items: [
      "예산 소진 및 이벤트 사정에 따라 조기 마감될 수 있으니, 결제 전 혜택 적용 여부를 꼭 확인해주세요.",
      "본 프로모션은 제휴사 사정에 따라 타 혜택과 중복적용이 되지 않을 수 있어요.",
      "최종 결제 금액이 최소 결제 금액보다 커야 혜택을 받을 수 있어요. 단, 최종 결제 금액은 토스포인트 차감 후 실 결제 금액이에요.",
      "할인 혜택은 결제 건당 1개만 적용받을 수 있어요. 적립 혜택은 조건에 따라 중복으로 적용 받을 수 있어요.",
      "토스 계좌 및 토스페이머니로 결제 시, 토스페이 충전 결제의 한도에 따라 1회 최대 200만원, 1인 최대 1,000만원까지만 결제할 수 있어요.",
      "결제처에서 하나카드를 선택하고 토스뱅크카드로 결제한 경우 혜택 적용 대상이 아니에요.",
      "할인/적립 혜택은 1원 단위로 적용돼요.",
      "후불결제(BNPL), 법인카드로 결제하면 혜택을 받을 수 없어요.",
      "상품권, 순금 등 일부 상품은 혜택을 받을 수 없어요.",
      "본 프로모션이 종료된 후에 결제를 전액 취소한 경우, 해당 혜택을 다시 받을 수 없어요. (직접 취소, 업체 사정에 따른 취소 모두 포함돼요.)",
      "행사 내용은 토스페이 및 제휴사의 사정으로 중단 또는 변동될 수 있어요.",
      "관련 문의는 토스 고객센터(1599-4905)로 문의 부탁드려요.",
    ],
  },
];

export default function TossEventPage() {
  const router = useRouter();

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#F5F6F9]">
      <Lnb initialActiveItem={null} className="z-50 shrink-0" />
      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <main className="relative">
          <header className="absolute inset-x-0 top-0 z-10 flex items-center gap-8 px-6 py-3">
            <TextButton
              label="뒤로가기"
              size="large"
              styleType="secondary"
              iconPosition="left"
              onClick={() => router.push(ROUTES.CREDIT)}
            />
          </header>

          {/* 이미지 높이 기준으로 크기를 고정하고, 화면이 좁아지면 좌우가 잘린다.
              1440px보다 넓은 화면에서는 이미지와 같은 그라데이션으로 양옆을 채운다. */}
          <section className="flex flex-col items-center gap-8 self-stretch overflow-hidden bg-[linear-gradient(180deg,#E2ECFF_0%,#CADDFE_100%)]">
            <Image
              src={tossEventImage}
              alt="토스페이 결제 시 최대 4천원 혜택 (26.09.28 ~ 26.12.28). EVENT 1: 1원 이상 결제 시 1% 즉시 할인 (최대 1,000원, 예산 소진 시 조기 종료). EVENT 2: 1원 이상 생애 첫 결제 시 3천원 즉시 적립 (1인 1회, 예산 소진 시 조기 종료)"
              sizes="1440px"
              loading="eager"
              className="h-[1055.5px] w-[1440px] max-w-none shrink-0"
            />
          </section>

          <section className="flex flex-col items-center gap-3 self-stretch bg-[#F9F9FD] px-6 py-16">
            <div className="flex flex-col items-start justify-center gap-8">
              <h2 className="text-h24-bold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
                [유의사항 안내]
              </h2>
              <div className="flex flex-col items-start gap-6">
                {NOTICE_SECTIONS.map((section) => (
                  <div
                    key={section.title}
                    className="flex flex-col items-start gap-6"
                  >
                    <h3 className="text-sub14-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
                      {section.title}
                    </h3>
                    <ul className="flex flex-col items-start gap-1">
                      {section.items.map((item) => (
                        <li
                          key={item}
                          className="flex gap-1 text-cap12-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]"
                        >
                          <span aria-hidden>·</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
