import { create } from "zustand";

interface CreditState {
  creditCount: number; // 현재 크레딧 잔액
  setCreditCount: (count: number) => void; // 크레딧 업데이트 함수
}

export const useCreditStore = create<CreditState>((set) => ({
  creditCount: 0,
  setCreditCount: (count) => set({ creditCount: count }),
}));
