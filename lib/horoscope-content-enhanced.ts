// 增强版星座运势内容生成器

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
    advice: string; // 建议
  };
}

// 星座特色描述模板
const signTemplates: Record<ZodiacSignId, {
  zh: {
    overall: string[];
    love: string[];
    career: string[];
    wealth: string[];
    health: string[];
    advice: string[];
  };
  en: {
    overall: string[];
    love: string[];
    career: string[];
    wealth: string[];
    health: string[];
    advice: string[];
  };
}> = {
  aries: {
    zh: {
      overall: ['充满活力的你', '行动力强的你', '热情洋溢的你'],
      love: ['主动表达感情', '热情如火', '直接坦率'],
      career: ['积极进取', '勇于挑战', '领导力强'],
      wealth: ['投资需谨慎', '理性消费', '抓住机会'],
      health: ['注意休息', '适度运动', '保持活力'],
      advice: ['保持热情但要有计划', '注意沟通方式', '合理安排时间'],
    },
    en: {
      overall: ['Energetic you', 'Action-oriented you', 'Enthusiastic you'],
      love: ['Express feelings actively', 'Passionate', 'Direct and honest'],
      career: ['Proactive', 'Dare to challenge', 'Strong leadership'],
      wealth: ['Invest carefully', 'Rational consumption', 'Seize opportunities'],
      health: ['Rest well', 'Moderate exercise', 'Maintain vitality'],
      advice: ['Stay enthusiastic but plan ahead', 'Pay attention to communication', 'Manage time well'],
    },
  },
  taurus: {
    zh: {
      overall: ['稳重的你', '务实的你', '可靠的你'],
      love: ['忠诚专一', '需要安全感', '重视承诺'],
      career: ['稳步前进', '注重实际', '有耐心'],
      wealth: ['理财有道', '稳健投资', '积累财富'],
      health: ['注意饮食', '规律作息', '适度放松'],
      advice: ['保持稳定但要有灵活性', '适当尝试新事物', '注意身体健康'],
    },
    en: {
      overall: ['Stable you', 'Practical you', 'Reliable you'],
      love: ['Loyal and devoted', 'Need security', 'Value commitment'],
      career: ['Steady progress', 'Focus on reality', 'Patient'],
      wealth: ['Good financial management', 'Steady investment', 'Accumulate wealth'],
      health: ['Watch diet', 'Regular routine', 'Moderate relaxation'],
      advice: ['Stay stable but be flexible', 'Try new things appropriately', 'Pay attention to health'],
    },
  },
  // 简化版，其他星座类似...
  gemini: {
    zh: {
      overall: ['灵活的你', '聪明的你', '善变的你'],
      love: ['需要新鲜感', '喜欢交流', '不喜欢束缚'],
      career: ['思维敏捷', '适应力强', '沟通能力强'],
      wealth: ['多渠道收入', '灵活理财', '抓住机会'],
      health: ['注意神经系统', '保持心情愉快', '适度运动'],
      advice: ['保持灵活性但要有专注', '注意沟通技巧', '合理安排时间'],
    },
    en: {
      overall: ['Flexible you', 'Smart you', 'Changeable you'],
      love: ['Need freshness', 'Like communication', 'Dislike constraints'],
      career: ['Quick thinking', 'Strong adaptability', 'Good communication'],
      wealth: ['Multiple income sources', 'Flexible finance', 'Seize opportunities'],
      health: ['Watch nervous system', 'Stay happy', 'Moderate exercise'],
      advice: ['Stay flexible but focus', 'Pay attention to communication', 'Manage time well'],
    },
  },
  cancer: {
    zh: {
      overall: ['情感丰富的你', '敏感的你', '保护性强的你'],
      love: ['情感细腻', '需要安全感', '重视家庭'],
      career: ['注重细节', '有耐心', '善于照顾他人'],
      wealth: ['稳健理财', '注重储蓄', '家庭投资'],
      health: ['注意情绪', '规律作息', '保持心情愉快'],
      advice: ['保持敏感但要有边界', '注意情绪管理', '重视家庭关系'],
    },
    en: {
      overall: ['Emotional you', 'Sensitive you', 'Protective you'],
      love: ['Emotionally delicate', 'Need security', 'Value family'],
      career: ['Detail-oriented', 'Patient', 'Good at caring'],
      wealth: ['Steady finance', 'Focus on savings', 'Family investment'],
      health: ['Watch emotions', 'Regular routine', 'Stay happy'],
      advice: ['Stay sensitive but set boundaries', 'Manage emotions', 'Value family'],
    },
  },
  leo: {
    zh: {
      overall: ['自信的你', '慷慨的你', '有魅力的你'],
      love: ['热情浪漫', '喜欢被崇拜', '需要关注'],
      career: ['领导力强', '有创造力', '喜欢表现'],
      wealth: ['大方消费', '投资有眼光', '享受生活'],
      health: ['注意心脏', '保持活力', '适度运动'],
      advice: ['保持自信但要有谦逊', '注意倾听他人', '合理安排开支'],
    },
    en: {
      overall: ['Confident you', 'Generous you', 'Charming you'],
      love: ['Passionate and romantic', 'Like to be admired', 'Need attention'],
      career: ['Strong leadership', 'Creative', 'Like to perform'],
      wealth: ['Generous spending', 'Good investment vision', 'Enjoy life'],
      health: ['Watch heart', 'Maintain vitality', 'Moderate exercise'],
      advice: ['Stay confident but humble', 'Listen to others', 'Manage expenses'],
    },
  },
  virgo: {
    zh: {
      overall: ['细心的你', '有条理的你', '追求完美的你'],
      love: ['谨慎认真', '需要时间了解', '重视细节'],
      career: ['注重细节', '有条理', '追求完美'],
      wealth: ['精打细算', '理性投资', '注重规划'],
      health: ['注意消化系统', '规律作息', '适度放松'],
      advice: ['保持细心但不要过度挑剔', '注意放松', '合理安排时间'],
    },
    en: {
      overall: ['Careful you', 'Organized you', 'Perfectionist you'],
      love: ['Cautious and serious', 'Need time to understand', 'Value details'],
      career: ['Detail-oriented', 'Organized', 'Pursue perfection'],
      wealth: ['Careful calculation', 'Rational investment', 'Focus on planning'],
      health: ['Watch digestive system', 'Regular routine', 'Moderate relaxation'],
      advice: ['Stay careful but don\'t be too picky', 'Relax', 'Manage time well'],
    },
  },
  libra: {
    zh: {
      overall: ['平衡的你', '优雅的你', '有魅力的你'],
      love: ['浪漫优雅', '需要平衡', '重视伴侣'],
      career: ['追求和谐', '有艺术感', '善于合作'],
      wealth: ['理性消费', '注重平衡', '投资有眼光'],
      health: ['注意肾脏', '保持平衡', '适度运动'],
      advice: ['保持平衡但要有主见', '注意决策', '合理安排时间'],
    },
    en: {
      overall: ['Balanced you', 'Elegant you', 'Charming you'],
      love: ['Romantic and elegant', 'Need balance', 'Value partner'],
      career: ['Pursue harmony', 'Artistic', 'Good at cooperation'],
      wealth: ['Rational consumption', 'Focus on balance', 'Good investment vision'],
      health: ['Watch kidneys', 'Maintain balance', 'Moderate exercise'],
      advice: ['Stay balanced but have opinions', 'Pay attention to decisions', 'Manage time well'],
    },
  },
  scorpio: {
    zh: {
      overall: ['深刻的你', '有洞察力的你', '意志坚强的你'],
      love: ['深情专一', '需要信任', '情感强烈'],
      career: ['有洞察力', '意志坚强', '善于研究'],
      wealth: ['投资有眼光', '理性理财', '注重长期'],
      health: ['注意生殖系统', '保持心情愉快', '适度运动'],
      advice: ['保持深刻但要有信任', '注意情绪管理', '合理安排时间'],
    },
    en: {
      overall: ['Deep you', 'Insightful you', 'Strong-willed you'],
      love: ['Deep and devoted', 'Need trust', 'Strong emotions'],
      career: ['Insightful', 'Strong will', 'Good at research'],
      wealth: ['Good investment vision', 'Rational finance', 'Focus on long-term'],
      health: ['Watch reproductive system', 'Stay happy', 'Moderate exercise'],
      advice: ['Stay deep but trust', 'Manage emotions', 'Manage time well'],
    },
  },
  sagittarius: {
    zh: {
      overall: ['乐观的你', '自由的你', '有冒险精神的你'],
      love: ['自由独立', '需要空间', '不喜欢束缚'],
      career: ['喜欢挑战', '有冒险精神', '适应力强'],
      wealth: ['投资有眼光', '理性消费', '抓住机会'],
      health: ['注意肝脏', '保持活力', '适度运动'],
      advice: ['保持乐观但要有计划', '注意承诺', '合理安排时间'],
    },
    en: {
      overall: ['Optimistic you', 'Free you', 'Adventurous you'],
      love: ['Free and independent', 'Need space', 'Dislike constraints'],
      career: ['Like challenges', 'Adventurous', 'Strong adaptability'],
      wealth: ['Good investment vision', 'Rational consumption', 'Seize opportunities'],
      health: ['Watch liver', 'Maintain vitality', 'Moderate exercise'],
      advice: ['Stay optimistic but plan', 'Pay attention to commitments', 'Manage time well'],
    },
  },
  capricorn: {
    zh: {
      overall: ['有责任感的你', '务实的你', '有野心的你'],
      love: ['认真负责', '需要时间', '重视稳定'],
      career: ['目标明确', '有野心', '有责任感'],
      wealth: ['稳健理财', '理性投资', '注重积累'],
      health: ['注意骨骼', '保持规律', '适度放松'],
      advice: ['保持责任感但要有灵活性', '注意放松', '合理安排时间'],
    },
    en: {
      overall: ['Responsible you', 'Practical you', 'Ambitious you'],
      love: ['Serious and responsible', 'Need time', 'Value stability'],
      career: ['Clear goals', 'Ambitious', 'Responsible'],
      wealth: ['Steady finance', 'Rational investment', 'Focus on accumulation'],
      health: ['Watch bones', 'Maintain regularity', 'Moderate relaxation'],
      advice: ['Stay responsible but flexible', 'Relax', 'Manage time well'],
    },
  },
  aquarius: {
    zh: {
      overall: ['创新的你', '独立的你', '人道主义的你'],
      love: ['需要自由', '重视友谊', '不喜欢束缚'],
      career: ['有创新精神', '独立自主', '适应力强'],
      wealth: ['投资有眼光', '理性消费', '注重未来'],
      health: ['注意循环系统', '保持活力', '适度运动'],
      advice: ['保持创新但要有计划', '注意情感表达', '合理安排时间'],
    },
    en: {
      overall: ['Innovative you', 'Independent you', 'Humanitarian you'],
      love: ['Need freedom', 'Value friendship', 'Dislike constraints'],
      career: ['Innovative', 'Independent', 'Strong adaptability'],
      wealth: ['Good investment vision', 'Rational consumption', 'Focus on future'],
      health: ['Watch circulatory system', 'Maintain vitality', 'Moderate exercise'],
      advice: ['Stay innovative but plan', 'Pay attention to emotional expression', 'Manage time well'],
    },
  },
  pisces: {
    zh: {
      overall: ['有同情心的你', '有创造力的你', '直觉强的你'],
      love: ['浪漫敏感', '需要理解', '情感丰富'],
      career: ['有创造力', '适应力强', '有艺术感'],
      wealth: ['理性理财', '投资有眼光', '注重精神'],
      health: ['注意脚部', '保持心情愉快', '适度运动'],
      advice: ['保持敏感但要有边界', '注意现实', '合理安排时间'],
    },
    en: {
      overall: ['Compassionate you', 'Creative you', 'Intuitive you'],
      love: ['Romantic and sensitive', 'Need understanding', 'Emotionally rich'],
      career: ['Creative', 'Strong adaptability', 'Artistic'],
      wealth: ['Rational finance', 'Good investment vision', 'Focus on spirit'],
      health: ['Watch feet', 'Stay happy', 'Moderate exercise'],
      advice: ['Stay sensitive but set boundaries', 'Pay attention to reality', 'Manage time well'],
    },
  },
};

// 生成随机运势内容（增强版）
export function generateDailyHoroscope(
  signId: ZodiacSignId,
  date: Date,
  locale: string = 'zh'
): HoroscopeContent {
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

  const colorsZh = ['红色', '橙色', '黄色', '绿色', '蓝色', '紫色', '粉色', '金色', '银色', '白色'];
  const colorsEn = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink', 'Gold', 'Silver', 'White'];
  const colors = locale === 'zh' ? colorsZh : colorsEn;
  
  const luckyColors = [
    colors[Math.floor(random(seed * 9) * colors.length)],
    colors[Math.floor(random(seed * 10) * colors.length)],
  ];

  const templates = signTemplates[signId]?.[locale as 'zh' | 'en'] || signTemplates.aries[locale as 'zh' | 'en'];
  
  const descriptions = {
    overall: getEnhancedDescription('overall', overall, templates.overall, locale),
    love: getEnhancedDescription('love', love, templates.love, locale),
    career: getEnhancedDescription('career', career, templates.career, locale),
    wealth: getEnhancedDescription('wealth', wealth, templates.wealth, locale),
    health: getEnhancedDescription('health', health, templates.health, locale),
    advice: templates.advice[Math.floor(random(seed * 11) * templates.advice.length)],
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

function getEnhancedDescription(
  _type: string,
  score: number,
  templates: string[],
  locale: string
): string {
  const template = templates[Math.floor(Math.random() * templates.length)];
  const scoreText = locale === 'zh'
    ? score >= 5 ? '非常' : score >= 4 ? '比较' : score >= 3 ? '一般' : '需要'
    : score >= 5 ? 'very' : score >= 4 ? 'quite' : score >= 3 ? 'average' : 'need to';
  
  const actionText = locale === 'zh'
    ? score >= 4 ? '，建议积极行动。' : '，建议保持谨慎。'
    : score >= 4 ? ', suggest taking action.' : ', suggest being cautious.';
  
  return `${scoreText}${template}${actionText}`;
}

// 生成每周运势（增强版）
export function generateWeeklyHoroscope(
  signId: ZodiacSignId,
  weekStart: Date,
  locale: string = 'zh'
): HoroscopeContent {
  return generateDailyHoroscope(signId, weekStart, locale);
}

// 生成每月运势（增强版）
export function generateMonthlyHoroscope(
  signId: ZodiacSignId,
  monthStart: Date,
  locale: string = 'zh'
): HoroscopeContent {
  return generateDailyHoroscope(signId, monthStart, locale);
}

