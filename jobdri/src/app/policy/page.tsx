import Link from "next/link";
import Lnb from "@/components/common/lnb/Lnb";
import { TERMS_TEXT, PRIVACY_TEXT } from "@/constants/policy";

type PolicyTab = "terms" | "privacy";

const TABS: { key: PolicyTab; label: string }[] = [
  { key: "terms", label: "이용약관" },
  { key: "privacy", label: "개인정보 처리방침" },
];

interface PolicyPageProps {
  searchParams: Promise<{ tab?: string | string[] }>;
}

// 서버 컴포넌트: 약관 본문은 HTML로만 전달되고 클라이언트 JS 번들에는 포함되지 않는다.
export default async function PolicyPage({ searchParams }: PolicyPageProps) {
  const { tab } = await searchParams;
  const activeTab: PolicyTab = tab === "privacy" ? "privacy" : "terms"; // 기본값은 terms

  return (
    <div className="flex min-h-screen w-full bg-[#F5F6F9]">
      <Lnb />
      <main className="flex-1 w-full max-w-[800px] px-8 pt-16 pb-32 mx-auto">
        <h1 className="text-3xl font-bold text-text-neutral-title mb-10">
          서비스 정책
        </h1>

        <div className="flex gap-6 mb-8 border-b border-gray-200">
          {TABS.map(({ key, label }) => (
            <Link
              key={key}
              href={`?tab=${key}`}
              replace
              scroll={false}
              aria-current={activeTab === key ? "page" : undefined}
              className={`pb-3 px-2 text-[18px] font-medium border-b-2 transition-colors ${
                activeTab === key
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-card shadow-sm p-8 min-h-[600px]">
          <div
            className="text-gray-700 whitespace-pre-wrap leading-[1.8] text-[15px]"
            dangerouslySetInnerHTML={{
              __html: activeTab === "terms" ? TERMS_TEXT : PRIVACY_TEXT,
            }}
          />
        </div>
      </main>
    </div>
  );
}
