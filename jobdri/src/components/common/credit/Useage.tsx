"use client";

import { useEffect, useState } from "react";
import CreditTable from "./CreditTable";
import {
  fetchCreditTransactions,
  type CreditTransaction,
  type TransactionType,
} from "@/lib/api/credit";

const typeLabel: Record<TransactionType, string> = {
  CHARGE: "충전",
  USE: "데이터 분석",
  REFUND: "환불",
  COUPON: "쿠폰",
};

function formatAmount(type: TransactionType, amount: number) {
  const sign = type === "USE" ? "" : "+";
  return `${sign}${amount.toLocaleString()}`;
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toRowData(tx: CreditTransaction) {
  return {
    id: String(tx.transactionId),
    dateTime: formatDateTime(tx.createdAt),
    typeLabel: typeLabel[tx.type],
    content: tx.description,
    amount: formatAmount(tx.type, tx.amount),
    balance: `${tx.balanceAfter.toLocaleString()}회`,
  };
}

export default function Useage() {
  const [rows, setRows] = useState<ReturnType<typeof toRowData>[]>([]);

  useEffect(() => {
    fetchCreditTransactions()
      .then((txs) => setRows(txs.map(toRowData)))
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-y-4">
      <h2 className="text-t20-semibold text-text-neutral-title">이용 내역</h2>
      <CreditTable rows={rows} />
    </div>
  );
}
