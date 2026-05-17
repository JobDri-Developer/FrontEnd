"use client";

import ModaInput from "../common/modal/ModalInput";
import { useState } from "react";

interface AddQuestionProps {
  onClose: () => void;
  onAdd: (question: string) => void;
}

export default function AddQuestion({ onClose, onAdd }: AddQuestionProps) {
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (question.trim() === "") {
      setError("유효한 문항을 입력해주세요.");
      return;
    }
    onAdd(question.trim());
    onClose();
  };

  return (
    <div>
      <ModaInput
        value={question}
        onChange={setQuestion}
        onSubmit={handleSubmit}
        onClose={onClose}
        onCancel={onClose}
        placeholder="추가할 문항을 입력해주세요."
        error={error}
        loading={false}
        announce="추가할 문항을 입력해주세요."
      />
    </div>
  );
}
