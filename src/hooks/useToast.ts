import { useState, useCallback } from 'react';

export type ToastType = 'error' | 'warning' | 'info' | 'success';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

const AUTO_DISMISS_MS = 3500;

/**
 * 輕量 Toast 通知系統，用於取代遊戲中阻塞式的 alert()
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, AUTO_DISMISS_MS);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, dismissToast };
}
