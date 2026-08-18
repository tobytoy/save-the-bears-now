import React from 'react';
import { X } from 'lucide-react';
import { RescueHistory } from '../../types';
import { BearIllustration } from '../Assets/BearIllustrations';

interface BearDexModalProps {
  rescueHistory: RescueHistory[];
  onClose: () => void;
}

const ALL_BEARS = [
  {
    type: 'FRACTURE' as const,
    name: '蹦蹦波波 (Bobo)',
    title: '骨折受傷熊',
    desc: '活潑好動的森林小熊，在石階奔跑扭傷後腿，需要骨科急救照 X 光。',
    preferredER: '重度級創傷中心'
  },
  {
    type: 'HEATSTROKE' as const,
    name: '雪泥可可 (Coco)',
    title: '高溫中暑熊',
    desc: '大熱天曬太陽頭昏眼花，耐受時間極短，需要火速送醫補充生理食鹽水降溫！',
    preferredER: '就近急診室 (空床優先)'
  },
  {
    type: 'FLU' as const,
    name: '哈啾皮皮 (Pipi)',
    title: '流感發燒熊',
    desc: '換季感冒發高燒咳不停，適合送往兒童醫院或設有小兒急診之大型醫院。',
    preferredER: '兒童醫院 / 醫學中心'
  },
  {
    type: 'HUNGRY' as const,
    name: '圓滾冬冬 (Dongdong)',
    title: '飢餓低血糖熊',
    desc: '迷路一整天沒吃東西，血糖過低腳軟暈倒，需要急救補給高濃度葡萄糖。',
    preferredER: '一般責任醫院'
  }
];

export const BearDexModal: React.FC<BearDexModalProps> = ({ rescueHistory, onClose }) => {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl">
              📖
            </div>
            <div>
              <h2 className="text-lg font-black text-white">熊熊救援圖鑑 (BearDex)</h2>
              <p className="text-xs text-slate-400">已累計救援 {rescueHistory.length} 次任務</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ALL_BEARS.map((bear) => {
              const savedCount = rescueHistory.filter((r) => r.bearType === bear.type).length;
              return (
                <div
                  key={bear.type}
                  className="bg-slate-800/50 border border-slate-700/70 rounded-2xl p-4 flex items-start gap-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0">
                    <BearIllustration type={bear.type} size={56} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-white">{bear.name}</h3>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                        救治 {savedCount} 次
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-400 font-bold mt-0.5">{bear.title}</div>
                    <p className="text-xs text-slate-300/80 mt-1 leading-relaxed">{bear.desc}</p>
                    <div className="text-[10px] text-sky-300 font-semibold mt-2">
                      💡 建議醫院：{bear.preferredER}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
