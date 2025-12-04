// 黄历数据生成器

export interface CalendarDay {
  date: Date;
  lunarDate: string; // 农历日期
  ganZhi: string; // 天干地支
  zodiac: string; // 生肖
  suitable: string[]; // 宜
  avoid: string[]; // 忌
  luckyHours: string[]; // 吉时
  unluckyHours: string[]; // 凶时
}

// 天干
const gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// 地支
const zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
// 生肖
const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

// 宜事项
const suitableItems = [
  '结婚', '订婚', '出行', '搬家', '开业', '装修', '动土', '安葬',
  '祭祀', '祈福', '求嗣', '开光', '入学', '考试', '签约', '交易',
  '纳财', '置产', '栽种', '破土', '上梁', '入宅', '安床', '拆卸',
];

// 忌事项
const avoidItems = [
  '结婚', '订婚', '出行', '搬家', '开业', '装修', '动土', '安葬',
  '祭祀', '祈福', '求嗣', '开光', '入学', '考试', '签约', '交易',
  '纳财', '置产', '栽种', '破土', '上梁', '入宅', '安床', '拆卸',
];

// 时辰
const hours = [
  { time: '23:00-01:00', name: '子时' },
  { time: '01:00-03:00', name: '丑时' },
  { time: '03:00-05:00', name: '寅时' },
  { time: '05:00-07:00', name: '卯时' },
  { time: '07:00-09:00', name: '辰时' },
  { time: '09:00-11:00', name: '巳时' },
  { time: '11:00-13:00', name: '午时' },
  { time: '13:00-15:00', name: '未时' },
  { time: '15:00-17:00', name: '申时' },
  { time: '17:00-19:00', name: '酉时' },
  { time: '19:00-21:00', name: '戌时' },
  { time: '21:00-23:00', name: '亥时' },
];

// 简化的农历转换（实际应该使用专业的农历库）
function getLunarDate(date: Date, locale: string = 'zh'): string {
  // 这里使用简化算法，实际应该使用专业的农历转换库
  // 例如：lunar-javascript
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // 简化版：返回格式化的日期
  if (locale === 'zh') {
    return `${year}年${month}月${day}日`;
  } else {
    return `${month}/${day}/${year}`;
  }
}

// 计算天干地支
function getGanZhi(date: Date): string {
  // 简化算法：基于年份计算
  const year = date.getFullYear();
  const ganIndex = (year - 4) % 10;
  const zhiIndex = (year - 4) % 12;
  return `${gan[ganIndex]}${zhi[zhiIndex]}`;
}

// 计算生肖
function getZodiac(date: Date): string {
  const year = date.getFullYear();
  const zodiacIndex = (year - 4) % 12;
  return zodiacs[zodiacIndex];
}

// 生成宜忌事项（基于日期生成稳定的随机数）
function generateSuitableAndAvoid(date: Date): { suitable: string[]; avoid: string[] } {
  const seed = date.getTime();
  const random = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 随机选择宜事项（3-5个）
  const suitableCount = Math.floor(random(seed) * 3) + 3;
  const suitable: string[] = [];
  const usedSuitable = new Set<number>();
  
  for (let i = 0; i < suitableCount; i++) {
    let index;
    do {
      index = Math.floor(random(seed * (i + 1)) * suitableItems.length);
    } while (usedSuitable.has(index));
    usedSuitable.add(index);
    suitable.push(suitableItems[index]);
  }

  // 随机选择忌事项（2-4个）
  const avoidCount = Math.floor(random(seed * 100) * 3) + 2;
  const avoid: string[] = [];
  const usedAvoid = new Set<number>();
  
  for (let i = 0; i < avoidCount; i++) {
    let index;
    do {
      index = Math.floor(random(seed * (i + 200)) * avoidItems.length);
    } while (usedAvoid.has(index));
    usedAvoid.add(index);
    avoid.push(avoidItems[index]);
  }

  return { suitable, avoid };
}

// 生成吉时和凶时
function generateLuckyHours(date: Date): { lucky: string[]; unlucky: string[] } {
  const seed = date.getTime();
  const random = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const luckyCount = Math.floor(random(seed) * 4) + 3; // 3-6个吉时
  const lucky: string[] = [];
  const unlucky: string[] = [];
  const used = new Set<number>();

  // 选择吉时
  for (let i = 0; i < luckyCount; i++) {
    let index;
    do {
      index = Math.floor(random(seed * (i + 1)) * hours.length);
    } while (used.has(index));
    used.add(index);
    lucky.push(hours[index].name);
  }

  // 剩余为凶时
  for (let i = 0; i < hours.length; i++) {
    if (!used.has(i)) {
      unlucky.push(hours[i].name);
    }
  }

  return { lucky, unlucky };
}

// 获取指定日期的黄历信息
export function getCalendarDay(date: Date, locale: string = 'zh'): CalendarDay {
  const lunarDate = getLunarDate(date, locale);
  const ganZhi = getGanZhi(date);
  const zodiac = getZodiac(date);
  const { suitable, avoid } = generateSuitableAndAvoid(date);
  const { lucky, unlucky } = generateLuckyHours(date);

  return {
    date,
    lunarDate,
    ganZhi,
    zodiac,
    suitable,
    avoid,
    luckyHours: lucky,
    unluckyHours: unlucky,
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

