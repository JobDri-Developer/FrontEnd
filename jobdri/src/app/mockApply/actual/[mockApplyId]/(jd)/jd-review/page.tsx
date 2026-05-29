"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Footer } from "@/components/common/footer";
import { ModalNotice } from "@/components/common/modal";
import JdReviewPageClient from "./JdReviewPageClient";
import QuestionGenerationLoading from "@/components/mockApply/QuestionGenerationLoading";
import {
  ingestJobPosting,
  saveJobPosting,
  waitForJobPostingIngest,
  type SavedJobPosting,
  type JobPostingSavePayload,
} from "@/lib/api/jobPostings";
import {
  createApplyFromJobPosting,
  getSelectedApplyType,
  saveMockApplyResumeRecord,
} from "@/lib/api/mockApplies";
import {
  emptyJdSections,
  getJdReviewMetadataStorageKey,
  getJdReviewSavedStorageKey,
  getJdReviewStorageKey,
  mockJdSections,
  type JdReviewMetadata,
  type JdReviewSection,
} from "@/components/mockApply/jd/jdReviewSections";

function subscribeToSessionStorage(onStoreChange: () => void) {
  const handleStorage = () => onStoreChange();

  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener("storage", handleStorage);
  };
}

function parseStoredSections(value: string | null) {
  if (!value) {
    return undefined;
  }

  try {
    const parsedSections = JSON.parse(value) as JdReviewSection[];
    return Array.isArray(parsedSections) && parsedSections.length > 0
      ? parsedSections
      : undefined;
  } catch {
    return undefined;
  }
}

function parseStoredMetadata(value: string | null) {
  if (!value) {
    return undefined;
  }

  try {
    return JSON.parse(value) as JdReviewMetadata;
  } catch {
    return undefined;
  }
}

function getSectionValue(sections: JdReviewSection[], id: string) {
  return sections.find((section) => section.id === id)?.value.trim() ?? "";
}

function createSavePayload(
  sections: JdReviewSection[],
  metadata?: JdReviewMetadata,
): JobPostingSavePayload {
  const companyName = getSectionValue(sections, "company");
  const detailClassificationId = metadata?.detailClassificationId;

  if (!companyName) {
    throw new Error("회사명을 입력해주세요.");
  }

  if (!detailClassificationId || detailClassificationId <= 0) {
    throw new Error(
      "직무 분류 정보가 없어 저장할 수 없습니다. 링크 또는 이미지로 공고를 입력하거나, 직접 작성용 소분류 선택 기능이 필요합니다.",
    );
  }

  return {
    companyName,
    companySize: metadata?.companySize?.trim() || "STARTUP",
    detailClassificationId,
    task: getSectionValue(sections, "main-task"),
    requirement: getSectionValue(sections, "qualification"),
    preferred: getSectionValue(sections, "preference"),
  };
}

function createQuestionLoadingDurationMs() {
  return 40000 + Math.floor(Math.random() * 20001);
}

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

interface QuestionLoadingInfo {
  companyName: string;
  jobName: string;
}

function createManualRawText(sections: JdReviewSection[]) {
  const rawText = sections
    .map(({ label, value }) => {
      const trimmedValue = value.trim();

      return trimmedValue ? `${label}\n${trimmedValue}` : "";
    })
    .filter(Boolean)
    .join("\n\n");

  if (!rawText) {
    throw new Error("공고 내용을 입력해주세요.");
  }

  return rawText;
}

async function createSavedJobPostingFromRawText(rawText: string) {
  const accepted = await ingestJobPosting({ rawText });
  const status = await waitForJobPostingIngest(accepted.taskId);
  const savedJobPosting = status.result?.saved;

  if (!savedJobPosting) {
    throw new Error(
      status.result?.message || "채용 공고 저장 결과를 확인할 수 없습니다.",
    );
  }

  return savedJobPosting;
}

function saveJdReviewSessionData({
  applyId,
  sections,
  savedJobPosting,
}: {
  applyId: string;
  sections: JdReviewSection[];
  savedJobPosting: SavedJobPosting;
}) {
  window.sessionStorage.setItem(
    getJdReviewStorageKey(applyId),
    JSON.stringify(sections),
  );
  window.sessionStorage.setItem(
    getJdReviewSavedStorageKey(applyId),
    JSON.stringify(savedJobPosting),
  );
  window.sessionStorage.setItem(
    getJdReviewMetadataStorageKey(applyId),
    JSON.stringify({
      companySize: savedJobPosting.companySize,
      detailClassificationId: savedJobPosting.detailClassificationId,
    }),
  );
}

export default function MockApplicationJdReviewPage() {
  const { mockApplyId: id } = useParams<{ mockApplyId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const storageKey = getJdReviewStorageKey(id);
  const storedSectionsValue = useSyncExternalStore(
    subscribeToSessionStorage,
    () => window.sessionStorage.getItem(storageKey) ?? "",
    () => "",
  );

  const reviewSections = useMemo(
    () =>
      mode === "manual"
        ? emptyJdSections
        : parseStoredSections(storedSectionsValue),
    [mode, storedSectionsValue],
  );
  const [currentSections, setCurrentSections] = useState<JdReviewSection[]>(
    reviewSections ?? mockJdSections,
  );
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [questionLoadingDurationMs, setQuestionLoadingDurationMs] =
    useState(50000);
  const [questionLoadingInfo, setQuestionLoadingInfo] =
    useState<QuestionLoadingInfo | null>(null);

  const openBackConfirm = () => setShowBackConfirm(true);
  const closeBackConfirm = () => setShowBackConfirm(false);
  const goToJdInput = () => router.replace(`/mockApply/actual/${id}/jd-input`);
  const closeSaveError = () => setSaveErrorMessage("");

  const handleConfirm = async () => {
    if (isSaving) {
      return;
    }

    setSaveErrorMessage("");
    const isManualMode = mode === "manual";
    let createSavedJobPosting: () => Promise<SavedJobPosting>;
    let loadingCompanyName = getSectionValue(currentSections, "company");

    try {
      if (isManualMode) {
        const rawText = createManualRawText(currentSections);
        createSavedJobPosting = () => createSavedJobPostingFromRawText(rawText);
      } else {
        const metadata = parseStoredMetadata(
          window.sessionStorage.getItem(getJdReviewMetadataStorageKey(id)),
        );
        const savePayload: JobPostingSavePayload = createSavePayload(
          currentSections,
          metadata,
        );

        loadingCompanyName = savePayload.companyName;
        createSavedJobPosting = () => saveJobPosting(savePayload);
      }
    } catch (error) {
      setSaveErrorMessage(
        error instanceof Error
          ? error.message
          : "채용 공고 저장에 실패했습니다.",
      );
      return;
    }

    const loadingDurationMs = createQuestionLoadingDurationMs();
    const nextQuestionLoadingInfo = {
      companyName: loadingCompanyName,
      jobName: getSectionValue(currentSections, "job"),
    };
    let shouldKeepLoading = false;

    setQuestionLoadingInfo(nextQuestionLoadingInfo);
    setQuestionLoadingDurationMs(loadingDurationMs);
    setIsSaving(true);

    try {
      const createNextApplyId = async () => {
        const savedJobPosting = await createSavedJobPosting();
        const createdApply = await createApplyFromJobPosting({
          jobPostingId: savedJobPosting.jobPostingId,
          applyType: getSelectedApplyType(),
        });
        const nextApplyId = String(createdApply.mockApplyId);

        saveMockApplyResumeRecord({
          jobPostingId: savedJobPosting.jobPostingId,
          mockApplyId: createdApply.mockApplyId,
          status: "APPLICATION_CREATED",
        });

        saveJdReviewSessionData({
          applyId: id,
          sections: currentSections,
          savedJobPosting,
        });
        saveJdReviewSessionData({
          applyId: nextApplyId,
          sections: currentSections,
          savedJobPosting,
        });

        return nextApplyId;
      };

      const [nextApplyId] = await Promise.all([
        createNextApplyId(),
        delay(loadingDurationMs),
      ]);

      shouldKeepLoading = true;
      router.push(`/mockApply/actual/${nextApplyId}/questions`);
    } catch (error) {
      setSaveErrorMessage(
        error instanceof Error
          ? error.message
          : "채용 공고 저장에 실패했습니다.",
      );
    } finally {
      if (!shouldKeepLoading) {
        setIsSaving(false);
      }
    }
  };

  const loadingCompanyName = getSectionValue(currentSections, "company");
  const loadingJobName = getSectionValue(currentSections, "job");
  const questionLoadingCompanyName =
    questionLoadingInfo?.companyName || loadingCompanyName;
  const questionLoadingJobName = questionLoadingInfo?.jobName || loadingJobName;

  return (
    <div className="flex min-h-screen flex-col bg-bg-default">
      {isSaving ? (
        <QuestionGenerationLoading
          companyName={questionLoadingCompanyName}
          jobName={questionLoadingJobName}
          durationMs={questionLoadingDurationMs}
        />
      ) : (
        <>
          <JdReviewPageClient
            sections={reviewSections}
            onSectionsChange={setCurrentSections}
          />
          <Footer
            ctaLabel="확정하기"
            backAction={{ onClick: openBackConfirm }}
            ctaAction={{
              onClick: handleConfirm,
            }}
          />
        </>
      )}

      {showBackConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-lightbox-default">
          <ModalNotice
            type="confirmationModal"
            title="공고 내용을 다시 업로드 하시겠습니까?"
            description="기존 정보는 저장되지 않고 삭제됩니다."
            onClose={closeBackConfirm}
            secondaryAction={{
              label: "다시 업로드",
              onClick: goToJdInput,
            }}
            primaryAction={{
              label: "계속 작성",
              onClick: closeBackConfirm,
            }}
          />
        </div>
      )}

      {saveErrorMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-lightbox-default">
          <ModalNotice
            type="alertModal"
            title="채용 공고 저장에 실패했습니다"
            description={saveErrorMessage}
            onClose={closeSaveError}
            primaryAction={{
              label: "닫기",
              onClick: closeSaveError,
            }}
          />
        </div>
      )}
    </div>
  );
}
