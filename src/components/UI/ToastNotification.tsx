import React from 'react';
import { X } from 'lucide-react';
import { Toast } from '../../hooks/useToast';

interface ToastNotificationProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const TOAST_STYLES: Record<Toast['type'], string> = {
  error:   'bg-rose-950/95 border-rose-500/60 text-rose-100',
  warning: 'bg-amber-950/95 border-amber-500/60 text-amber-100',
  success: 'bg-emerald-950/95 border-emerald-500/60 text-emerald-100',
  info:    'bg-slate-900/95 border-slate-600/60 text-slate-100',
};

const TOAST_ICONS: Record<Toast['type'], string> = {
  error:   '🚨',
  warning: '⚠️',
  success: '✅',
  info:    'ℹ️',
};

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-[72px] right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl text-sm font-semibold max-w-sm w-full ${TOAST_STYLES[toast.type]}`}
        >
          <span className="text-base flex-shrink-0 mt-0.5">{TOAST_ICONS[toast.type]}</span>
          <span className="flex-1 leading-snug">{toast.message}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            className="flex-shrink-0 opacity-50 hover:opacity-90 transition-opacity mt-0.5"
            aria-label="關閉通知"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
