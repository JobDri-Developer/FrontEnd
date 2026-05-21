"use client";

import ModalAdd from "../common/modal/ModalAdd";

interface AddQuestionProps {
  onClose: () => void;
  onAdd: (question: string, maxLength: number) => void;
}

export default function AddQuestion({ onClose, onAdd }: AddQuestionProps) {
  return <ModalAdd onClose={onClose} onAdd={onAdd} />;
}
