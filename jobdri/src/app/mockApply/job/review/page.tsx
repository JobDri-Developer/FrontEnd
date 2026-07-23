"use client";

import { useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/header/Header";
import SideHeaderContainer from "@/components/common/header/SideHeaderContainer";
import {
  LnbScrollbar,
  lnbHiddenScrollbarClass,
  useLnbScrollMetrics,
} from "@/components/common/lnb/LnbScrollbar";
import { CtaFooter } from "@/components/common/cta";
import { JDInput } from "@/components/common/input";
import { ModalNotice } from "@/components/common/modal";
import Avatar, {
  type AvatarColor,
} from "@/components/mockApply/home/Avatar";
import {
  clearJobPostingInput,
  getJobPostingAnalysis,
} from "../jobPostingDraftStore";
import {
  saveJobPosting,
  updateJobPosting,
  type JobPostingSavePayload,
  type JobPostingProfileColor,
} from "@/lib/api/jobPostings";
import {
  createApplyFromJobPosting,
  getSelectedApplyType,
} from "@/lib/api/mockApplies";

function firstNonEmpty(...values: Array<string | null | undefined>) {
  return values.find((value) => value?.trim())?.trim() ?? "";
}

const wizardSteps = [
  { label: "공고 확인" },
  { label: "자소서 입력" },
  { label: "첨삭 결과" },
];

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex w-full min-w-[612px] max-w-[1000px] flex-col items-start gap-6 rounded-card bg-bg-contents-default px-5 pt-6 pb-7">
      <div className="flex items-center justify-center gap-2.5 px-1">
        <h2 className="text-[18px] leading-[26px] font-semibold tracking-[-0.36px] text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
          {title}
        </h2>
      </div>

      <div className="flex self-stretch flex-col items-start gap-1">
        {children}
      </div>
    </section>
  );
}

function JobProfileRow({
  avatarName,
  profileColor,
  onProfileColorChange,
}: {
  avatarName: string;
  profileColor: JobPostingProfileColor;
  onProfileColorChange: (color: JobPostingProfileColor) => void;
}) {
  return (
    <div className="flex w-full items-start gap-8 px-2 py-5">
      <div className="flex w-[200px] shrink-0 flex-col items-start justify-center gap-1">
        <div className="flex items-center gap-1.5 self-stretch">
          <span className="text-b16-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
            공고 프로필
          </span>
          <svg
            aria-hidden="true"
            className="h-[5px] w-[5px] shrink-0"
            viewBox="0 0 5 5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="2.5"
              cy="2.5"
              r="2"
              fill="var(--color-fill-system-fail-strong)"
              stroke="#FF4242"
            />
          </svg>
        </div>

        <span className="text-cap12-med text-text-neutral-disabled [font-feature-settings:'liga'_off,'clig'_off]">
          이 공고의 프로필 색상을 선택해 주세요.
        </span>
      </div>

      <div className="flex flex-1 items-start py-0.5">
        <Avatar
          name={avatarName}
          type="company"
          color={profileColor}
          size="large"
          isEditable
          onChange={(color: AvatarColor) =>
            onProfileColorChange(
              color.toUpperCase() as JobPostingProfileColor,
            )
          }
          className="!h-11 !w-11"
        />
      </div>
    </div>
  );
}

export default function JobPostingReviewPage() {
  const router = useRouter();
  const [initialValues] = useState(() => {
    const result = getJobPostingAnalysis();
    const generated = result?.generated;
    const extracted = result?.extracted;
    const saved = result?.saved;

    return {
      companyName: firstNonEmpty(
        saved?.companyName,
        generated?.companyName,
        extracted?.companyName,
      ),
      postingName: firstNonEmpty(
        saved?.postingName,
        generated?.jobTitle,
        extracted?.jobTitle,
        saved?.jobTitle,
        result?.classification?.detailClassificationName,
        saved?.detailClassificationName,
      ),
      jobTitle: firstNonEmpty(
        saved?.jobTitle,
        generated?.jobTitle,
        extracted?.jobTitle,
        result?.classification?.detailClassificationName,
        saved?.detailClassificationName,
      ),
      task: firstNonEmpty(generated?.task, extracted?.task, saved?.task),
      requirements: firstNonEmpty(
        generated?.requirements,
        extracted?.requirements,
        saved?.requirement,
      ),
      preferred: firstNonEmpty(
        generated?.preferredQualifications,
        extracted?.preferredQualifications,
        saved?.preferred,
      ),
      companySize: saved?.companySize?.trim() || "STARTUP",
      profileColor: saved?.profileColor ?? "DEFAULT",
      detailClassificationId:
        saved?.detailClassificationId ??
        result?.classification?.detailClassificationId ??
        result?.candidates?.[0]?.detailClassificationId ??
        0,
      jobPostingId: saved?.jobPostingId ?? null,
    };
  });
  const [profileColor, setProfileColor] =
    useState<JobPostingProfileColor>(initialValues.profileColor);
  const [jobPostingName, setJobPostingName] = useState(
    initialValues.postingName,
  );
  const [companyName, setCompanyName] = useState(initialValues.companyName);
  const [roleName, setRoleName] = useState(initialValues.jobTitle);
  const [task, setTask] = useState(initialValues.task);
  const [requirements, setRequirements] = useState(
    initialValues.requirements,
  );
  const [preferred, setPreferred] = useState(initialValues.preferred);
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [showHomeConfirm, setShowHomeConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState("");
  const { scrollAreaRef, scrollbarMetrics, updateScrollbarMetrics } =
    useLnbScrollMetrics(true, "job-posting-review", { trackPadding: 28 });
  const companyAvatarName = useMemo(() => {
    const trimmedCompanyName = companyName.trim();

    return trimmedCompanyName.length > 0 ? trimmedCompanyName[0] : "T";
  }, [companyName]);
  const isNextEnabled = useMemo(
    () =>
      [jobPostingName, companyName, roleName].every(
        (value) => value.trim().length > 0,
      ),
    [companyName, jobPostingName, roleName],
  );
  const handleHomeClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowHomeConfirm(true);
  };
  const handleNext = async () => {
    if (!isNextEnabled || isSaving) {
      return;
    }

    setIsSaving(true);
    setSaveErrorMessage("");

    try {
      if (initialValues.detailClassificationId <= 0) {
        throw new Error("직무 분류 정보가 없어 공고를 저장할 수 없습니다.");
      }

      const payload: JobPostingSavePayload = {
        profileColor,
        postingName: jobPostingName.trim(),
        companyName: companyName.trim(),
        companySize: initialValues.companySize,
        jobTitle: roleName.trim(),
        detailClassificationId: initialValues.detailClassificationId,
        task: task.trim(),
        requirement: requirements.trim(),
        preferred: preferred.trim(),
      };
      const savedJobPosting = initialValues.jobPostingId
        ? await updateJobPosting(initialValues.jobPostingId, payload)
        : await saveJobPosting(payload);
      const createdApply = await createApplyFromJobPosting({
        jobPostingId: savedJobPosting.jobPostingId,
        applyType: getSelectedApplyType(),
      });

      clearJobPostingInput();
      router.push(
        `/mockApply/${createdApply.mockApplyId}?jobPostingId=${savedJobPosting.jobPostingId}`,
      );
    } catch (error) {
      setSaveErrorMessage(
        error instanceof Error
          ? error.message
          : "채용 공고를 저장하지 못했습니다.",
      );
      setIsSaving(false);
    }
  };

  return (
    <div className="h-dvh w-dvw overflow-hidden bg-line-neutral-assistive">
      <div className="flex h-dvh w-dvw min-w-[1100px] flex-col bg-bg-white">
        <Header
          companyName={companyName}
          jobTitle={roleName}
          applicationLabel="첫 번째 지원"
          currentStep={1}
          steps={wizardSteps}
          lastSavedAt="17:00"
          homeAction={{
            label: "홈으로",
            onClick: handleHomeClick,
          }}
          className="min-w-[1100px] max-w-none shrink-0 self-stretch"
        />

        <div className="relative flex min-h-0 w-full flex-1 items-stretch overflow-visible px-2 pb-0">
          <div
            ref={scrollAreaRef}
            onScroll={updateScrollbarMetrics}
            className={`flex min-h-0 w-full flex-1 items-start justify-center overflow-y-auto overflow-x-hidden rounded-card-l bg-fill-quaternary-assistive ${lnbHiddenScrollbarClass}`}
          >
            <div className="flex min-h-full flex-1 items-start justify-center self-stretch bg-fill-quaternary-assistive">
              <main className="flex flex-1 items-start justify-between">
                <SideHeaderContainer
                  leading={1}
                  title="공고 내용을 확인해주세요."
                  subtitle="입력해 준 내용을 바탕으로 AI가 자동으로 추출한 정보예요. 고치고 싶은 부분이 있다면 수정 버튼을 눌러 원하는 내용을 입력해주세요."
                  element={<></>}
                  className="shrink-0 self-stretch"
                />

                <div className="flex [flex:1_0_0] flex-col items-center gap-3 pt-16 pr-[72px] pl-20">
                  <SectionCard title="공고 정보 편집">
                    <JobProfileRow
                      avatarName={companyAvatarName}
                      profileColor={profileColor}
                      onProfileColorChange={setProfileColor}
                    />
                    <JDInput
                      label="공고명"
                      description="이 공고의 이름이에요."
                      type="company"
                      value={jobPostingName}
                      onChange={setJobPostingName}
                      className="!w-full"
                    />
                    <JDInput
                      label="회사명"
                      description="채용 공고를 올린 회사예요."
                      type="company"
                      value={companyName}
                      onChange={setCompanyName}
                      className="!w-full"
                    />
                  </SectionCard>

                  <SectionCard title="직무 정보">
                    <JDInput
                      type="role"
                      value={roleName}
                      onChange={setRoleName}
                      className="!w-full"
                    />
                    <JDInput
                      type="task"
                      description="이 직무에서 담당할 업무예요."
                      required={false}
                      value={task}
                      onChange={setTask}
                      className="!w-full"
                    />
                  </SectionCard>

                  <SectionCard title="채용 기준">
                    <JDInput
                      type="qualification"
                      required={false}
                      value={requirements}
                      onChange={setRequirements}
                      className="!w-full"
                    />
                    <JDInput
                      type="prefer"
                      required={false}
                      value={preferred}
                      onChange={setPreferred}
                      className="!w-full"
                    />
                  </SectionCard>

                  <div aria-hidden="true" className="h-[108px] shrink-0" />
                </div>
              </main>
            </div>
          </div>
          <LnbScrollbar
            metrics={scrollbarMetrics}
            size="l"
            className="!top-[10px] !right-1 !bottom-[10px] z-10"
          />
        </div>

        <CtaFooter
          type="wizard"
          className="!w-full shrink-0"
          backAction={{
            label: "이전으로",
            onClick: () => setShowBackConfirm(true),
          }}
          nextAction={{
            label: "다음으로",
            disabled: !isNextEnabled || isSaving,
            onClick: () => void handleNext(),
          }}
        />
      </div>

      {showBackConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-lightbox-default">
          <ModalNotice
            type="confirmationModal"
            title="공고 입력으로 돌아갈까요?"
            description="공고 확인에서 수정한 내용은 저장되지 않아요."
            onClose={() => setShowBackConfirm(false)}
            secondaryAction={{
              label: "돌아가기",
              onClick: () =>
                router.push("/mockApply/job/create?analysisCanceled=1"),
            }}
            primaryAction={{
              label: "계속 작성",
              onClick: () => setShowBackConfirm(false),
            }}
          />
        </div>
      )}

      {showHomeConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-lightbox-default">
          <ModalNotice
            type="confirmationModal"
            title="페이지를 나가시겠어요?"
            description="자동 저장 이후 작성된 내용은 저장되지 않아요."
            onClose={() => setShowHomeConfirm(false)}
            secondaryAction={{
              label: "홈으로",
              onClick: () => router.push("/"),
            }}
            primaryAction={{
              label: "취소",
              onClick: () => setShowHomeConfirm(false),
            }}
          />
        </div>
      )}

      {saveErrorMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-lightbox-default">
          <ModalNotice
            type="noticeModal"
            title="공고를 저장하지 못했습니다."
            description={saveErrorMessage}
            onClose={() => setSaveErrorMessage("")}
            primaryAction={{
              label: "확인",
              onClick: () => setSaveErrorMessage(""),
            }}
          />
        </div>
      )}
    </div>
  );
}
