"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Footer } from "@/components/common/footer";
import { ModalNotice } from "@/components/common/modal";
import JdReviewPageClient from "./JdReviewPageClient";
import {
  saveJobPosting,
  type JobPostingSavePayload,
} from "@/lib/api/jobPostings";
import {
  createApplyFromJobPosting,
  getSelectedApplyType,
} from "@/lib/api/mockApplies";
import {
  emptyJdSections,
  getJdReviewMetadataStorageKey,
  getJdReviewSavedStorageKey,
  getJdReviewStorageKey,
  mockJdSections,
  type JdReviewMetadata,
  type JdReviewSection,
} from "@/components/mock-application/jdReviewSections";

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

  if (!companyName) {
    throw new Error("회사명을 입력해주세요.");
  }

  return {
    companyName,
    companySize: metadata?.companySize?.trim() || "STARTUP",
    detailClassificationId: metadata?.detailClassificationId ?? 0,
    task: getSectionValue(sections, "main-task"),
    requirement: getSectionValue(sections, "qualification"),
    preferred: getSectionValue(sections, "preference"),
  };
}

function copySessionStorageValue(sourceKey: string, targetKey: string) {
  if (sourceKey === targetKey) {
    return;
  }

  const value = window.sessionStorage.getItem(sourceKey);

  if (value) {
    window.sessionStorage.setItem(targetKey, value);
  }
}

export default function MockApplicationJdReviewPage() {
  const { id } = useParams<{ id: string }>();
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

  const openBackConfirm = () => setShowBackConfirm(true);
  const closeBackConfirm = () => setShowBackConfirm(false);
  const goToJdInput = () => router.replace(`/apply/virtual/${id}/jd-input`);
  const closeSaveError = () => setSaveErrorMessage("");

  const handleConfirm = async () => {
    if (isSaving) {
      return;
    }

    setSaveErrorMessage("");
    setIsSaving(true);

    try {
      const metadata =
        mode === "manual"
          ? undefined
          : parseStoredMetadata(
              window.sessionStorage.getItem(getJdReviewMetadataStorageKey(id)),
            );
      const savedJobPosting = await saveJobPosting(
        createSavePayload(currentSections, metadata),
      );
      const createdApply = await createApplyFromJobPosting({
        jobPostingId: savedJobPosting.jobPostingId,
        applyType: getSelectedApplyType(),
      });
      const nextApplyId = String(createdApply.mockApplyId);

      window.sessionStorage.setItem(
        getJdReviewSavedStorageKey(id),
        JSON.stringify(savedJobPosting),
      );
      window.sessionStorage.setItem(
        getJdReviewSavedStorageKey(nextApplyId),
        JSON.stringify(savedJobPosting),
      );
      copySessionStorageValue(storageKey, getJdReviewStorageKey(nextApplyId));
      copySessionStorageValue(
        getJdReviewMetadataStorageKey(id),
        getJdReviewMetadataStorageKey(nextApplyId),
      );
      router.push(`/apply/virtual/${nextApplyId}/questions`);
    } catch (error) {
      setSaveErrorMessage(
        error instanceof Error
          ? error.message
          : "채용 공고 저장에 실패했습니다.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-default">
      <JdReviewPageClient
        sections={reviewSections}
        onSectionsChange={setCurrentSections}
      />
      <Footer
        ctaLabel={isSaving ? "저장 중" : "확정하기"}
        backAction={{ onClick: openBackConfirm }}
        ctaAction={{
          disabled: isSaving,
          onClick: handleConfirm,
        }}
      />

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
