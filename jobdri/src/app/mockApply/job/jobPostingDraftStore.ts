"use client";

interface JobPostingDraft {
  files: File[];
  value: string;
}

let jobPostingDraft: JobPostingDraft = {
  files: [],
  value: "",
};

export function getJobPostingDraft() {
  return jobPostingDraft;
}

export function saveJobPostingDraft(draft: JobPostingDraft) {
  jobPostingDraft = {
    files: draft.files,
    value: draft.value,
  };
}

export function clearJobPostingDraft() {
  jobPostingDraft = {
    files: [],
    value: "",
  };
}
