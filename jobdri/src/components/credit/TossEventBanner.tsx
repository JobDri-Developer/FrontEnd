import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { ROUTES } from "@/constants/routes";
import tossBannerImage from "@/assets/img_toss_banner.png";

interface TossEventBannerProps {
  className?: string;
}

export default function TossEventBanner({ className }: TossEventBannerProps) {
  return (
    <Link
      href={ROUTES.CREDIT_TOSS_EVENT}
      aria-label="토스페이 결제 시 최대 4천원 혜택 이벤트 보러가기"
      className={clsx(
        "block w-full overflow-hidden rounded-card shadow-card transition-opacity hover:opacity-90",
        className,
      )}
    >
      <Image
        src={tossBannerImage}
        alt="토스페이 결제 시 최대 4천원 혜택"
        sizes="(max-width: 1320px) 100vw, 1184px"
        className="h-auto w-full"
        priority
      />
    </Link>
  );
}
