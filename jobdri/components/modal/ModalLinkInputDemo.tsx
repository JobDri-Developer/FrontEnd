"use client";

import { useState } from "react";
import ModalInput from "./ModalInput";
import Button from "@/components/buttons/Button";

export default function ModalLinkInputDemo() {
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<"action" | "alort">("action");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleOpen = () => {
    setVariant("action");
    setUrl("");
    setOpen(true);
  };

  const handleSubmit = () => {
    // action → alort, alort → action
    if (url === "" || !url.startsWith("https://")) {
      setError("유효한 링크를 입력해주세요.");
    } else {
      setError("");
      setVariant((prev) => (prev === "action" ? "alort" : "action"));
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button label="모달 열기" size="small" onClick={handleOpen} />

      {open && (
        <ModalInput
          variant={variant}
          value={url}
          onChange={setUrl}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onClose={handleClose}
          announce="공고 링크를 입력해주세요."
          description="링크 내용이 부적절한 경우 제대로 추출되지 않을 수 있습니다."
          error={error}
        />
      )}
    </>
  );
}
