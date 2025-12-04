// 八字算命核心计算逻辑

import type { BaziResult } from './fortune-data';

// 天干
const gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// 地支
const zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
// 生肖
const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
// 五行
const wuxingList = ['金', '木', '水', '火', '土'];

// 天干对应的五行
const ganWuxing: Record<string, string> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

// 地支对应的五行
const zhiWuxing: Record<string, string> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水',
};

// 计算年柱
function getYearGanZhi(year: number): string {
  const ganIndex = (year - 4) % 10;
  const zhiIndex = (year - 4) % 12;
  return `${gan[ganIndex]}${zhi[zhiIndex]}`;
}

// 计算月柱（根据年干和月份）
function getMonthGanZhi(year: number, month: number): string {
  // 月支固定（简化版）
  const monthZhi = (month + 1) % 12;
  
  // 根据年干计算月干（简化算法）
  const yearGanIndex = (year - 4) % 10;
  const monthGanIndex = (yearGanIndex * 2 + month) % 10;
  
  return `${gan[monthGanIndex]}${zhi[monthZhi]}`;
}

// 计算日柱（使用1900年1月1日为基准）
function getDayGanZhi(date: Date): string {
  const baseDate = new Date(1900, 0, 1);
  const diffDays = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const ganIndex = (diffDays + 6) % 10;
  const zhiIndex = (diffDays + 6) % 12;
  return `${gan[ganIndex]}${zhi[zhiIndex]}`;
}

// 计算时柱（根据日干和时辰）
function getHourGanZhi(dayGan: string, hour: number): string {
  const ganIndex = gan.indexOf(dayGan[0]);
  const hourZhiIndex = Math.floor((hour + 1) / 2) % 12;
  const hourGanIndex = (ganIndex * 2 + hourZhiIndex) % 10;
  return `${gan[hourGanIndex]}${zhi[hourZhiIndex]}`;
}

// 计算五行分布
function calculateWuxing(yearGanZhi: string, monthGanZhi: string, dayGanZhi: string, hourGanZhi: string): {
  metal: number;
  wood: number;
  water: number;
  fire: number;
  earth: number;
} {
  const wuxing: Record<string, number> = {
    '金': 0,
    '木': 0,
    '水': 0,
    '火': 0,
    '土': 0,
  };

  // 统计天干五行
  [yearGanZhi, monthGanZhi, dayGanZhi, hourGanZhi].forEach((ganZhi) => {
    const ganChar = ganZhi[0];
    const zhiChar = ganZhi[1];
    
    if (ganWuxing[ganChar]) {
      wuxing[ganWuxing[ganChar]]++;
    }
    if (zhiWuxing[zhiChar]) {
      wuxing[zhiWuxing[zhiChar]]++;
    }
  });

  return {
    metal: wuxing['金'],
    wood: wuxing['木'],
    water: wuxing['水'],
    fire: wuxing['火'],
    earth: wuxing['土'],
  };
}

// 生成八字分析
function generateAnalysis(
  yearGanZhi: string,
  monthGanZhi: string,
  dayGanZhi: string,
  hourGanZhi: string,
  wuxing: { metal: number; wood: number; water: number; fire: number; earth: number },
  locale: string = 'zh'
): string {
  const isZh = locale === 'zh';
  
  // 找出最多的五行和最少的五行
  const wuxingArray = [
    { name: isZh ? '金' : 'Metal', value: wuxing.metal },
    { name: isZh ? '木' : 'Wood', value: wuxing.wood },
    { name: isZh ? '水' : 'Water', value: wuxing.water },
    { name: isZh ? '火' : 'Fire', value: wuxing.fire },
    { name: isZh ? '土' : 'Earth', value: wuxing.earth },
  ];
  
  const sorted = [...wuxingArray].sort((a, b) => b.value - a.value);
  const maxElement = sorted[0];
  const minElement = sorted[sorted.length - 1];
  
  // 日主（日干）
  const dayGan = dayGanZhi[0];
  const dayGanWuxing = ganWuxing[dayGan];
  
  let analysis = '';
  
  if (isZh) {
    analysis = `您的八字为：${yearGanZhi} ${monthGanZhi} ${dayGanZhi} ${hourGanZhi}。\n\n`;
    analysis += `日主为${dayGan}（${dayGanWuxing}），五行分布：金${wuxing.metal}、木${wuxing.wood}、水${wuxing.water}、火${wuxing.fire}、土${wuxing.earth}。\n\n`;
    
    // 五行分析
    if (maxElement.value >= 3) {
      analysis += `${maxElement.name}元素较旺，`;
      if (maxElement.name === dayGanWuxing) {
        analysis += '日主得助，性格较为强势，有领导才能。';
      } else {
        analysis += '可能对日主形成压力，需要注意平衡。';
      }
    } else if (minElement.value === 0) {
      analysis += `${minElement.name}元素缺失，`;
      analysis += '建议在生活中多接触相关元素，以平衡五行。';
    } else {
      analysis += '五行分布相对均衡，性格较为平和，适应能力强。';
    }
    
    analysis += '\n\n';
    
    // 性格特点（基于日主）
    const personalityTraits: Record<string, string> = {
      '甲': '性格直率，有领导力，做事果断。',
      '乙': '性格温和，善于沟通，适应能力强。',
      '丙': '性格热情，积极向上，有创造力。',
      '丁': '性格细腻，注重细节，有艺术天赋。',
      '戊': '性格稳重，踏实可靠，有责任感。',
      '己': '性格包容，善于协调，人际关系好。',
      '庚': '性格刚强，意志坚定，有执行力。',
      '辛': '性格敏锐，善于分析，追求完美。',
      '壬': '性格灵活，适应力强，有智慧。',
      '癸': '性格温和，善于思考，有洞察力。',
    };
    
    analysis += `性格特点：${personalityTraits[dayGan] || '性格特点需要结合整体八字分析。'}\n\n`;
    
    // 建议
    analysis += '建议：八字仅供参考，人生的成功更多取决于后天的努力和选择。保持积极的心态，发挥自己的优势，克服不足，才能创造美好的未来。';
  } else {
    analysis = `Your Bazi is: ${yearGanZhi} ${monthGanZhi} ${dayGanZhi} ${hourGanZhi}.\n\n`;
    analysis += `Day Master is ${dayGan} (${dayGanWuxing}), Five Elements distribution: Metal ${wuxing.metal}, Wood ${wuxing.wood}, Water ${wuxing.water}, Fire ${wuxing.fire}, Earth ${wuxing.earth}.\n\n`;
    
    if (maxElement.value >= 3) {
      analysis += `${maxElement.name} element is strong. `;
      if (maxElement.name === dayGanWuxing) {
        analysis += 'Day Master is supported, indicating strong character and leadership ability.';
      } else {
        analysis += 'May create pressure on Day Master, balance is needed.';
      }
    } else if (minElement.value === 0) {
      analysis += `${minElement.name} element is missing. `;
      analysis += 'Suggest incorporating related elements in life to balance the Five Elements.';
    } else {
      analysis += 'Five Elements are relatively balanced, indicating peaceful character and strong adaptability.';
    }
    
    analysis += '\n\n';
    
    const personalityTraits: Record<string, string> = {
      '甲': 'Straightforward character, leadership ability, decisive.',
      '乙': 'Gentle character, good communication skills, adaptable.',
      '丙': 'Enthusiastic character, positive attitude, creative.',
      '丁': 'Detail-oriented character, artistic talent.',
      '戊': 'Stable character, reliable, responsible.',
      '己': 'Tolerant character, good at coordination, good interpersonal relationships.',
      '庚': 'Strong character, determined, executive ability.',
      '辛': 'Sharp character, analytical, perfectionist.',
      '壬': 'Flexible character, adaptable, wise.',
      '癸': 'Gentle character, thoughtful, insightful.',
    };
    
    analysis += `Personality traits: ${personalityTraits[dayGan] || 'Personality traits need to be analyzed in combination with the overall Bazi.'}\n\n`;
    analysis += 'Note: Bazi is for reference only. Success in life depends more on hard work and choices. Maintain a positive attitude, leverage your strengths, and overcome weaknesses to create a better future.';
  }
  
  return analysis;
}

// 计算八字
export function calculateBazi(
  birthDate: Date,
  birthHour: number,
  locale: string = 'zh'
): BaziResult {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  
  const yearGanZhi = getYearGanZhi(year);
  const monthGanZhi = getMonthGanZhi(year, month);
  const dayGanZhi = getDayGanZhi(birthDate);
  const hourGanZhi = getHourGanZhi(dayGanZhi, birthHour);
  
  const wuxing = calculateWuxing(yearGanZhi, monthGanZhi, dayGanZhi, hourGanZhi);
  const analysis = generateAnalysis(yearGanZhi, monthGanZhi, dayGanZhi, hourGanZhi, wuxing, locale);
  
  return {
    yearGanZhi,
    monthGanZhi,
    dayGanZhi,
    hourGanZhi,
    wuxing,
    analysis,
  };
}

// 获取生肖
export function getZodiac(year: number): string {
  const zodiacIndex = (year - 4) % 12;
  return zodiacs[zodiacIndex];
}

