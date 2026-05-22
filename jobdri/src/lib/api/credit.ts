import { getAuthHeaders } from "../auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type TransactionType = "CHARGE" | "USE" | "REFUND" | "COUPON";

export interface CreditTransaction {
  transactionId: number;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  description: string;
  referenceId: string;
  createdAt: string;
}

interface ApiResponse<T> {
  result: T;
  error: string | null;
}

export async function fetchCreditBalance(): Promise<number> {
  const response = await fetch(`${BASE_URL}/api/payments/credits/me`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("크레딧 잔액 조회에 실패했습니다.");
  const { result }: ApiResponse<{ creditBalance: number }> =
    await response.json();
  return result.creditBalance;
}

export async function fetchCreditTransactions(
  type?: TransactionType,
): Promise<CreditTransaction[]> {
  const url = new URL(`${BASE_URL}/api/payments/credits/me/transactions`);
  if (type) url.searchParams.set("type", type);

  const response = await fetch(url.toString(), {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("크레딧 거래 내역 조회에 실패했습니다.");
  const { result }: ApiResponse<CreditTransaction[]> = await response.json();
  return result;
}

export type PlanCode = "ONE_TIME" | "FIVE_TIMES" | "TEN_TIMES";

export interface CreditPlan {
  planCode: PlanCode;
  name: string;
  creditAmount: number;
  price: number;
  recommended: boolean;
}

export async function fetchCreditPlans(): Promise<CreditPlan[]> {
  const response = await fetch(`${BASE_URL}/api/payments/plans`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("크레딧 플랜 조회에 실패했습니다.");
  const { result }: ApiResponse<CreditPlan[]> = await response.json();
  return result;
}
