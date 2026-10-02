import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { ROUTES } from "@/constants/routes";
import tossPayLogo from "@/assets/logo_toss_primary.png";
import tossPayAltLogo from "@/assets/logo_toss_alternative.png";

interface TossEventBannerProps {
  className?: string;
}

// 크레딧 카드 영역과 같은 너비로 늘어나는 배너.
// 내부는 1060x160 고정 캔버스를 가운데 정렬해서, 1060보다 좁아지면 좌우가 잘리고
// 넓어지면 양옆이 배경(흰색, 배경 원)으로 채워진다.
export default function TossEventBanner({ className }: TossEventBannerProps) {
  return (
    <Link
      href={ROUTES.CREDIT_TOSS_EVENT}
      aria-label="토스페이 이용하면 토스포인트 3,000원 적립 이벤트 보러가기"
      className={clsx(
        "relative block h-40 w-full overflow-hidden rounded-card-l bg-white transition-opacity hover:opacity-90",
        className,
      )}
    >
      <div className="absolute top-0 left-1/2 h-40 w-[1060px] -translate-x-1/2">
        {/* 배경 원 */}
        <div className="absolute top-[-276.5px] left-[560px] size-[713px] rounded-full bg-[#C7E4FF] blur-[200px]" />

        {/* 왼쪽 글자 그룹 */}
        <Image
          src={tossPayAltLogo}
          alt=""
          sizes="118px"
          loading="eager"
          className="absolute top-[7px] left-[126px] h-[59px] w-[118px] object-cover"
        />
        <p className="absolute top-[60px] left-[152px] text-h28-bold text-[#2D3542] [font-feature-settings:'liga'_off,'clig'_off]">
          토스페이 이용하면
          <br />
          토스포인트 적립
        </p>

        {/* 우측 카드 이미지 */}
        <div className="absolute top-[-23.4px] left-[636px] h-[158px] w-[277px] rotate-[22.758deg] rounded-16 bg-[#EEEFF4] mix-blend-multiply" />
        <div className="absolute top-px left-[604px] h-[158px] w-[277px] rotate-[12.255deg] rounded-16 bg-white">
          <Image
            src={tossPayLogo}
            alt="토스페이"
            sizes="279px"
            loading="eager"
            className="absolute top-px left-[-1px] h-[93px] w-[279px] max-w-none object-cover"
          />
          <p className="absolute top-[71px] w-full text-center text-[44px] leading-[130%] font-bold tracking-[-0.88px] text-[#0067FF] [font-feature-settings:'liga'_off,'clig'_off]">
            3,000원
          </p>
        </div>
      </div>
    </Link>
  );
}
