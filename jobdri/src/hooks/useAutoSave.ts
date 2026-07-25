import { useEffect, useRef } from "react";

// T: 감지할 데이터의 타입
// R: API 호출 후 반환되는 결과값의 타입 (기본값은 void)
interface UseAutoSaveProps<T, R = void> {
  data: T;
  onSave: (data: T) => Promise<R>; // any 대신 제네릭 R 사용
  delay?: number;
  enabled?: boolean;
  onSuccess?: (savedTime: string, result: R) => void; // any 대신 제네릭 R 사용
  onError?: (error: unknown) => void;
}

export function useAutoSave<T, R = void>({
  data,
  onSave,
  delay = 1000,
  enabled = true,
  onSuccess,
  onError,
}: UseAutoSaveProps<T, R>) {
  const isInitialRender = useRef(true);
  const isSaving = useRef(false);

  const onSaveRef = useRef(onSave);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onSaveRef.current = onSave;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSave, onSuccess, onError]);

  useEffect(() => {
    if (!enabled) return;

    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const timer = setTimeout(async () => {
      if (isSaving.current) return;
      isSaving.current = true;

      try {
        const result = await onSaveRef.current(data);
        const now = new Date();
        const timeString = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

        onSuccessRef.current?.(timeString, result);
      } catch (error) {
        console.error("자동 저장 에러:", error);
        onErrorRef.current?.(error);
      } finally {
        isSaving.current = false;
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [data, delay, enabled]);
}
