"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CreditTable from "./CreditTable";
import { Pagination } from "@/components/common/Pagination";
import type { CreditTransaction, TransactionType } from "@/lib/api/credit";
import { creditTransactionsQueryOptions } from "@/lib/queries";

const typeLabel: Record<TransactionType, string> = {
  CHARGE: "충전",
  USE: "데이터 분석",
  REFUND: "환불",
  COUPON: "쿠폰",
};

const TRANSACTIONS_PER_PAGE = 20;

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

type TransactionRow = ReturnType<typeof toRowData>;

const EMPTY_ROWS: TransactionRow[] = [];

function selectRows(transactions: CreditTransaction[]): TransactionRow[] {
  return transactions.map(toRowData);
}

export default function Useage() {
  const { data: rows = EMPTY_ROWS } = useQuery({
    ...creditTransactionsQueryOptions(),
    select: selectRows,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(rows.length / TRANSACTIONS_PER_PAGE),
  );
  const visibleRows = rows.slice(
    (currentPage - 1) * TRANSACTIONS_PER_PAGE,
    currentPage * TRANSACTIONS_PER_PAGE,
  );

  return (
    <div className="flex flex-col gap-y-4">
      <h2 className="text-t20-semibold text-text-neutral-title">이용 내역</h2>
      <CreditTable rows={visibleRows} />
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
