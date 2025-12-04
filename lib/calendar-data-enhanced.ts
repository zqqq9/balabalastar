// 增强版黄历数据生成器

export interface CalendarDay {
  date: Date;
  lunarDate: string; // 农历日期
  ganZhi: {
    year: string; // 年柱
    month: string; // 月柱
    day: string; // 日柱
    hour: string; // 时柱
  };
  zodiac: string; // 生肖
  suitable: Array<{ name: string; category: string }>; // 宜（带分类）
  avoid: Array<{ name: string; category: string }>; // 忌（带分类）
  luckyHours: Array<{ time: string; name: string; description: string }>; // 吉时（带描述）
  unluckyHours: Array<{ time: string; name: string }>; // 凶时
  wuxing: string; // 五行
  jieqi?: string; // 节气
  festivals: string[]; // 节日
}

// 天干
const gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// 地支
const zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
// 生肖
const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
// 五行
const wuxingList = ['金', '木', '水', '火', '土'];

// 宜事项（分类）
const suitableItems = {
  marriage: ['结婚', '订婚', '纳采', '问名', '纳征', '请期', '亲迎'],
  travel: ['出行', '旅游', '搬家', '迁居', '入宅'],
  business: ['开业', '开张', '交易', '签约', '纳财', '置产', '投资'],
  construction: ['动土', '装修', '上梁', '安床', '拆卸', '破土', '修造'],
  spiritual: ['祭祀', '祈福', '求嗣', '开光', '还愿', '拜神'],
  education: ['入学', '考试', '拜师', '学习'],
  health: ['求医', '治病', '养生'],
  other: ['栽种', '纳畜', '捕捉', '畋猎'],
};

// 忌事项（分类）
const avoidItems = {
  marriage: ['结婚', '订婚', '纳采'],
  travel: ['出行', '远行', '搬家'],
  business: ['开业', '开张', '交易'],
  construction: ['动土', '装修', '破土'],
  spiritual: ['祭祀', '祈福'],
  other: ['安葬', '入殓', '移柩', '开仓', '出货'],
};

// 时辰（带描述）
const hours = [
  { time: '23:00-01:00', name: '子时', description: '夜深人静，适合休息' },
  { time: '01:00-03:00', name: '丑时', description: '深夜时分，宜静不宜动' },
  { time: '03:00-05:00', name: '寅时', description: '黎明前，新的一天开始' },
  { time: '05:00-07:00', name: '卯时', description: '日出时分，充满活力' },
  { time: '07:00-09:00', name: '辰时', description: '早晨时光，适合开始工作' },
  { time: '09:00-11:00', name: '巳时', description: '上午时光，精力充沛' },
  { time: '11:00-13:00', name: '午时', description: '正午时分，阳气最盛' },
  { time: '13:00-15:00', name: '未时', description: '午后时光，适合小憩' },
  { time: '15:00-17:00', name: '申时', description: '下午时光，适合社交' },
  { time: '17:00-19:00', name: '酉时', description: '傍晚时分，适合总结' },
  { time: '19:00-21:00', name: '戌时', description: '夜晚开始，适合学习' },
  { time: '21:00-23:00', name: '亥时', description: '深夜前，适合放松' },
];

// 计算天干地支（年）
function getYearGanZhi(year: number): string {
  const ganIndex = (year - 4) % 10;
  const zhiIndex = (year - 4) % 12;
  return `${gan[ganIndex]}${zhi[zhiIndex]}`;
}

// 计算天干地支（月）
function getMonthGanZhi(year: number, month: number): string {
  // 简化算法，实际应该更复杂
  const baseMonth = (year - 4) % 5;
  const ganIndex = (baseMonth * 2 + month - 1) % 10;
  const zhiIndex = (month + 1) % 12;
  return `${gan[ganIndex]}${zhi[zhiIndex]}`;
}

// 计算天干地支（日）
function getDayGanZhi(date: Date): string {
  // 使用1900年1月1日为基准（甲子日）
  const baseDate = new Date(1900, 0, 1);
  const diffDays = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const ganIndex = (diffDays + 6) % 10; // 1900年1月1日是甲午日
  const zhiIndex = (diffDays + 6) % 12;
  return `${gan[ganIndex]}${zhi[zhiIndex]}`;
}

// 计算天干地支（时）
function getHourGanZhi(dayGan: string, hour: number): string {
  const ganIndex = gan.indexOf(dayGan[0]);
  const hourZhiIndex = Math.floor((hour + 1) / 2) % 12;
  const hourGanIndex = (ganIndex * 2 + hourZhiIndex) % 10;
  return `${gan[hourGanIndex]}${zhi[hourZhiIndex]}`;
}

// 计算生肖
function getZodiac(year: number): string {
  const zodiacIndex = (year - 4) % 12;
  return zodiacs[zodiacIndex];
}

// 计算五行
function getWuxing(ganZhi: string): string {
  const ganChar = ganZhi[0];
  
  // 简化算法
  const ganWuxing: Record<string, string> = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
    '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
  };
  
  return ganWuxing[ganChar] || wuxingList[Math.floor(Math.random() * 5)];
}

// 生成农历日期（简化版，实际应该使用专业库）
function getLunarDate(date: Date, locale: string = 'zh'): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  if (locale === 'zh') {
    return `${year}年${month}月${day}日`;
  } else {
    return `${month}/${day}/${year}`;
  }
}

// 生成宜忌事项（增强版）
function generateSuitableAndAvoid(date: Date): {
  suitable: Array<{ name: string; category: string }>;
  avoid: Array<{ name: string; category: string }>;
} {
  const seed = date.getTime();
  const random = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const suitable: Array<{ name: string; category: string }> = [];
  const avoid: Array<{ name: string; category: string }> = [];

  // 生成宜事项（每个分类随机选1-2个）
  Object.entries(suitableItems).forEach(([category, items], catIndex) => {
    const maxCount = Math.min(Math.floor(random(seed * (catIndex + 1)) * 2) + 1, items.length);
    const availableIndices = Array.from({ length: items.length }, (_, i) => i);
    // Shuffle using deterministic random
    for (let i = availableIndices.length - 1; i > 0; i--) {
      const j = Math.floor(random(seed * (catIndex * 100 + i)) * (i + 1));
      [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
    }
    // Take first maxCount items
    for (let i = 0; i < maxCount; i++) {
      suitable.push({ name: items[availableIndices[i]], category });
    }
  });

  // 生成忌事项
  Object.entries(avoidItems).forEach(([category, items], catIndex) => {
    const maxCount = Math.min(Math.floor(random(seed * (catIndex + 100)) * 2) + 1, items.length);
    const availableIndices = Array.from({ length: items.length }, (_, i) => i);
    // Shuffle using deterministic random
    for (let i = availableIndices.length - 1; i > 0; i--) {
      const j = Math.floor(random(seed * (catIndex * 100 + i + 200)) * (i + 1));
      [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
    }
    // Take first maxCount items
    for (let i = 0; i < maxCount; i++) {
      avoid.push({ name: items[availableIndices[i]], category });
    }
  });

  return { suitable, avoid };
}

// 生成吉时和凶时（增强版）
function generateLuckyHours(date: Date): {
  lucky: Array<{ time: string; name: string; description: string }>;
  unlucky: Array<{ time: string; name: string }>;
} {
  const seed = date.getTime();
  const random = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const lucky: Array<{ time: string; name: string; description: string }> = [];
  const unlucky: Array<{ time: string; name: string }> = [];

  // 选择吉时（4-6个）
  const luckyCount = Math.min(Math.floor(random(seed) * 3) + 4, hours.length);
  const availableIndices = Array.from({ length: hours.length }, (_, i) => i);
  
  // Shuffle using deterministic random
  for (let i = availableIndices.length - 1; i > 0; i--) {
    const j = Math.floor(random(seed * (i + 1)) * (i + 1));
    [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
  }
  
  // Take first luckyCount items as lucky hours
  for (let i = 0; i < luckyCount; i++) {
    const index = availableIndices[i];
    lucky.push({
      time: hours[index].time,
      name: hours[index].name,
      description: hours[index].description,
    });
  }

  // 剩余为凶时
  for (let i = luckyCount; i < hours.length; i++) {
    const index = availableIndices[i];
    unlucky.push({
      time: hours[index].time,
      name: hours[index].name,
    });
  }

  return { lucky, unlucky };
}

// 获取指定日期的黄历信息（增强版）
export function getCalendarDay(date: Date, locale: string = 'zh'): CalendarDay {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const hour = date.getHours();

  const lunarDate = getLunarDate(date, locale);
  const yearGanZhi = getYearGanZhi(year);
  const monthGanZhi = getMonthGanZhi(year, month);
  const dayGanZhi = getDayGanZhi(date);
  const hourGanZhi = getHourGanZhi(dayGanZhi, hour);

  const zodiac = getZodiac(year);
  const wuxing = getWuxing(dayGanZhi);
  const { suitable, avoid } = generateSuitableAndAvoid(date);
  const { lucky, unlucky } = generateLuckyHours(date);

  return {
    date,
    lunarDate,
    ganZhi: {
      year: yearGanZhi,
      month: monthGanZhi,
      day: dayGanZhi,
      hour: hourGanZhi,
    },
    zodiac,
    suitable,
    avoid,
    luckyHours: lucky,
    unluckyHours: unlucky,
    wuxing,
    festivals: [], // TODO: 添加节日数据
  };
}

// 获取多天的黄历信息
export function getCalendarDays(startDate: Date, days: number, locale: string = 'zh'): CalendarDay[] {
  const result: CalendarDay[] = [];
  const currentDate = new Date(startDate);
  
  for (let i = 0; i < days; i++) {
    const day = new Date(currentDate);
    day.setDate(currentDate.getDate() + i);
    result.push(getCalendarDay(day, locale));
  }
  
  return result;
}

