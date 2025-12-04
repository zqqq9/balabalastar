// 算命占卜相关数据

// 八字相关
export interface BaziResult {
  yearGanZhi: string; // 年柱
  monthGanZhi: string; // 月柱
  dayGanZhi: string; // 日柱
  hourGanZhi: string; // 时柱
  wuxing: {
    metal: number; // 金
    wood: number; // 木
    water: number; // 水
    fire: number; // 火
    earth: number; // 土
  };
  analysis: string; // 分析
}

// 塔罗牌接口和函数已移至 tarot-cards-complete.ts
// 抽塔罗牌（使用完整版）
export { drawTarotCards } from './tarot-cards-complete';
export type { TarotCard } from './tarot-cards-complete';

