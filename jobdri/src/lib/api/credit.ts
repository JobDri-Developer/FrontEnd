import {
  API_BASE_URL,
  getAuthHeaders,
  handleUnauthorized,
} from "@/lib/api/client";

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

function checkResponse(
  response: Response,
  fallbackMessage: string,
  redirectOnUnauthorized = true,
): void {
  if (response.status === 401 && redirectOnUnauthorized) handleUnauthorized();
  if (!response.ok) throw new Error(fallbackMessage);
}

export async function fetchCreditBalance({
  redirectOnUnauthorized = true,
}: { redirectOnUnauthorized?: boolean } = {}): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/api/payments/credits/me`, {
    headers: getAuthHeaders(),
  });
  checkResponse(
    response,
    "크레딧 잔액 조회에 실패했습니다.",
    redirectOnUnauthorized,
  );
  const { result }: ApiResponse<{ creditBalance: number }> =
    await response.json();
  return result.creditBalance;
}

export async function fetchCreditTransactions(
  type?: TransactionType,
): Promise<CreditTransaction[]> {
  const url = new URL(`${API_BASE_URL}/api/payments/credits/me/transactions`);
  if (type) url.searchParams.set("type", type);

  const response = await fetch(url.toString(), {
    headers: getAuthHeaders(),
  });
  checkResponse(response, "크레딧 거래 내역 조회에 실패했습니다.");
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
  const response = await fetch(`${API_BASE_URL}/api/payments/plans`, {
    headers: getAuthHeaders(),
  });
  checkResponse(response, "크레딧 플랜 조회에 실패했습니다.");
  const { result }: ApiResponse<CreditPlan[]> = await response.json();
  return result;
}

export interface PreparePaymentResult {
  paymentId: number;
  orderId: string;
  orderName: string;
  amount: number;
  creditAmount: number;
  clientKey: string;
  customerEmail: string;
}

export async function preparePurchase(
  planCode: PlanCode,
): Promise<PreparePaymentResult> {
  const response = await fetch(`${API_BASE_URL}/api/payments/prepare`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ planCode }),
  });
  checkResponse(response, "결제 준비에 실패했습니다.");
  const { result }: ApiResponse<PreparePaymentResult> = await response.json();
  return result;
}

// export async function confirmPurchase(
//   paymentKey: string,
//   orderId: string,
//   amount: number,
// ): Promise<void> {
//   const response = await fetch(`${API_BASE_URL}/api/payments/confirm`, {
//     method: "POST",
//     headers: {
//       ...getAuthHeaders(),
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ paymentKey, orderId, amount }),
//   });
//   checkResponse(response, "결제 승인에 실패했습니다.");
// }

export async function checkPaymentStatus(orderId: string) {
  const response = await fetch(`/api/payments/orders/${orderId}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch payment status");
  return response.json();
}
