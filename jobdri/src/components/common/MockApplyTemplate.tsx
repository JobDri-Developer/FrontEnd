import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Header from "@/components/common/header/Header";
import CtaFooter from "@/components/common/cta/CtaFooter";
import { fetchSequence } from "@/lib/api/result";
import { LEAVE_MODAL_CONFIG } from "@/constants/modalConfig";
import ModalNotice from "@/components/common/modal/ModalNotice";
import { type IconType } from "@/components/common/icons/Icon"; // 👈 아이콘 타입 임포트 추가

interface MockApplyTemplateProps {
  mockApplyId: number;
  currentStep: number;
  companyName?: string;
  jobTitle?: string;

  children: React.ReactNode;
  customHomeModal?: (typeof LEAVE_MODAL_CONFIG)[keyof typeof LEAVE_MODAL_CONFIG];
  onHomeLeave?: () => void;

  lastSavedAt?: string;
  onHomeClick?: () => void;
  onBackClick?: () => void;
  onNextClick?: () => void;
  isNextDisabled?: boolean;
  onRetryClick?: () => void;
  onSaveAndExitClick?: () => void;
  nextLabel?: string;
  nextIconType?: IconType;
}

export default function MockApplyTemplate({
  mockApplyId,
  children,
  currentStep,
  companyName,
  jobTitle,
  customHomeModal = LEAVE_MODAL_CONFIG.COMMON_HOME,
  onHomeLeave,

  lastSavedAt,
  onBackClick,
  onNextClick,
  isNextDisabled,
  onRetryClick,
  onSaveAndExitClick,
  nextLabel = "다음으로",
  nextIconType,
}: MockApplyTemplateProps) {
  const router = useRouter();
  const [showHomeConfirm, setShowHomeConfirm] = useState(false);
  const pathname = usePathname();
  const isResultPage = pathname.includes("/result");

  const handleHomeLeave = () => {
    if (onHomeLeave) onHomeLeave();
    else router.push("/");
  };

  const [applicationLabel, setApplicationLabel] =
    useState<string>("첫 번째 지원");

  useEffect(() => {
    const loadSequence = async () => {
      if (!mockApplyId) return;
      try {
        const data = await fetchSequence(mockApplyId);
        setApplicationLabel(`${data.sequence}번째 지원`);
      } catch (error) {
        console.error("순번을 불러오지 못했습니다.", error);
      }
    };

    loadSequence();
  }, [mockApplyId]);

  return (
    <div className="flex flex-col h-dvh bg-bg-default overflow-hidden">
      <Header
        companyName={companyName}
        jobTitle={jobTitle}
        currentStep={currentStep}
        lastSavedAt={lastSavedAt}
        applicationLabel={applicationLabel}
        homeAction={{
          label: "홈으로",
          onClick: (e) => {
            e.preventDefault();
            setShowHomeConfirm(true);
          },
        }}
      />

      <main className="flex-1 overflow-y-auto">{children}</main>

      <CtaFooter
        type={isResultPage ? "result" : "wizard"}
        backAction={{ onClick: onBackClick }}
        nextAction={{
          label: nextLabel,
          iconType: nextIconType,
          onClick: onNextClick,
          disabled: isNextDisabled,
        }}
        retryAction={{ onClick: onRetryClick }}
        saveAction={{ onClick: onSaveAndExitClick }}
      />

      {showHomeConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-lightbox-default">
          <ModalNotice
            type="confirmation"
            title={customHomeModal.title}
            description={customHomeModal.description}
            onClose={() => setShowHomeConfirm(false)}
            secondaryAction={{
              label: customHomeModal.secondaryBtn,
              onClick: handleHomeLeave,
            }}
            primaryAction={{
              label: customHomeModal.primaryBtn,
              onClick: () => setShowHomeConfirm(false),
            }}
          />
        </div>
      )}
    </div>
  );
}
