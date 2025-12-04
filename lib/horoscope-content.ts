// 星座运势内容生成器（示例数据）
// 实际项目中可以从 API 或数据库获取

import { ZodiacSignId } from './horoscope-data';

export interface HoroscopeContent {
  overall: number; // 综合运势 1-5
  love: number;
  career: number;
  wealth: number;
  health: number;
  luckyNumber: number[];
  luckyColor: string[];
  description: {
    overall: string;
    love: string;
    career: string;
    wealth: string;
    health: string;
  };
}

// 生成随机运势内容（示例）
export function generateDailyHoroscope(
  signId: ZodiacSignId,
  date: Date,
  locale: string = 'zh'
): HoroscopeContent {
  // 使用日期和星座ID生成稳定的随机数
  const seed = date.getTime() + signId.charCodeAt(0);
  const random = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const overall = Math.floor(random(seed) * 3) + 3; // 3-5
  const love = Math.floor(random(seed * 2) * 3) + 3;
  const career = Math.floor(random(seed * 3) * 3) + 3;
  const wealth = Math.floor(random(seed * 4) * 3) + 3;
  const health = Math.floor(random(seed * 5) * 3) + 3;

  const luckyNumbers = [
    Math.floor(random(seed * 6) * 50) + 1,
    Math.floor(random(seed * 7) * 50) + 1,
    Math.floor(random(seed * 8) * 50) + 1,
  ];

  const colorsZh = ['红色', '橙色', '黄色', '绿色', '蓝色', '紫色', '粉色', '金色'];
  const colorsEn = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink', 'Gold'];
  const colors = locale === 'zh' ? colorsZh : colorsEn;
  
  const luckyColors = [
    colors[Math.floor(random(seed * 9) * colors.length)],
    colors[Math.floor(random(seed * 10) * colors.length)],
  ];

  const descriptions = {
    overall: getOverallDescription(overall, signId, locale),
    love: getLoveDescription(love, signId, locale),
    career: getCareerDescription(career, signId, locale),
    wealth: getWealthDescription(wealth, signId, locale),
    health: getHealthDescription(health, signId, locale),
  };

  return {
    overall,
    love,
    career,
    wealth,
    health,
    luckyNumber: luckyNumbers,
    luckyColor: luckyColors,
    description: descriptions,
  };
}

function getOverallDescription(score: number, _signId: ZodiacSignId, locale: string): string {
  if (locale === 'zh') {
    const base = `今天是${score === 5 ? '非常' : score === 4 ? '比较' : ''}顺利的一天，`;
    const tips = score >= 4 ? '保持积极心态，抓住机会。' : '保持耐心，稳步前进。';
    return base + tips;
  } else {
    const base = `Today is a ${score === 5 ? 'very' : score === 4 ? 'quite' : ''} smooth day, `;
    const tips = score >= 4 ? 'stay positive and seize opportunities.' : 'stay patient and move forward steadily.';
    return base + tips;
  }
}

function getLoveDescription(score: number, _signId: ZodiacSignId, locale: string): string {
  if (locale === 'zh') {
    return score >= 4 
      ? '感情运势不错，适合表达心意或增进感情。'
      : '感情方面需要更多沟通和理解。';
  } else {
    return score >= 4
      ? 'Love fortune is good, suitable for expressing feelings or strengthening relationships.'
      : 'More communication and understanding are needed in relationships.';
  }
}

function getCareerDescription(score: number, _signId: ZodiacSignId, locale: string): string {
  if (locale === 'zh') {
    return score >= 4
      ? '工作运势良好，可能会有新的机会或突破。'
      : '工作方面需要更加努力和专注。';
  } else {
    return score >= 4
      ? 'Career fortune is good, there may be new opportunities or breakthroughs.'
      : 'More effort and focus are needed at work.';
  }
}

function getWealthDescription(score: number, _signId: ZodiacSignId, locale: string): string {
  if (locale === 'zh') {
    return score >= 4
      ? '财运不错，但要注意理性消费。'
      : '财运一般，建议谨慎理财。';
  } else {
    return score >= 4
      ? 'Wealth fortune is good, but be mindful of rational spending.'
      : 'Wealth fortune is average, suggest careful financial management.';
  }
}

function getHealthDescription(score: number, _signId: ZodiacSignId, locale: string): string {
  if (locale === 'zh') {
    return score >= 4
      ? '健康状况良好，保持规律作息。'
      : '注意休息，适当运动，保持身心健康。';
  } else {
    return score >= 4
      ? 'Health condition is good, maintain regular routine.'
      : 'Pay attention to rest, exercise appropriately, maintain physical and mental health.';
  }
}

// 生成每周运势
export function generateWeeklyHoroscope(
  signId: ZodiacSignId,
  weekStart: Date,
  locale: string = 'zh'
): HoroscopeContent {
  return generateDailyHoroscope(signId, weekStart, locale);
}

// 生成每月运势
export function generateMonthlyHoroscope(
  signId: ZodiacSignId,
  monthStart: Date,
  locale: string = 'zh'
): HoroscopeContent {
  return generateDailyHoroscope(signId, monthStart, locale);
}
