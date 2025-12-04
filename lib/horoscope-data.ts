// 星座基础数据
export const zodiacSigns = [
  { id: 'aries', nameZh: '白羊座', nameEn: 'Aries', dateRange: '3/21-4/19', element: 'fire', emoji: '♈' },
  { id: 'taurus', nameZh: '金牛座', nameEn: 'Taurus', dateRange: '4/20-5/20', element: 'earth', emoji: '♉' },
  { id: 'gemini', nameZh: '双子座', nameEn: 'Gemini', dateRange: '5/21-6/21', element: 'air', emoji: '♊' },
  { id: 'cancer', nameZh: '巨蟹座', nameEn: 'Cancer', dateRange: '6/22-7/22', element: 'water', emoji: '♋' },
  { id: 'leo', nameZh: '狮子座', nameEn: 'Leo', dateRange: '7/23-8/22', element: 'fire', emoji: '♌' },
  { id: 'virgo', nameZh: '处女座', nameEn: 'Virgo', dateRange: '8/23-9/22', element: 'earth', emoji: '♍' },
  { id: 'libra', nameZh: '天秤座', nameEn: 'Libra', dateRange: '9/23-10/23', element: 'air', emoji: '♎' },
  { id: 'scorpio', nameZh: '天蝎座', nameEn: 'Scorpio', dateRange: '10/24-11/22', element: 'water', emoji: '♏' },
  { id: 'sagittarius', nameZh: '射手座', nameEn: 'Sagittarius', dateRange: '11/23-12/21', element: 'fire', emoji: '♐' },
  { id: 'capricorn', nameZh: '摩羯座', nameEn: 'Capricorn', dateRange: '12/22-1/19', element: 'earth', emoji: '♑' },
  { id: 'aquarius', nameZh: '水瓶座', nameEn: 'Aquarius', dateRange: '1/20-2/18', element: 'air', emoji: '♒' },
  { id: 'pisces', nameZh: '双鱼座', nameEn: 'Pisces', dateRange: '2/19-3/20', element: 'water', emoji: '♓' },
] as const;

export type ZodiacSignId = typeof zodiacSigns[number]['id'];

export function getZodiacSignById(id: string) {
  return zodiacSigns.find(sign => sign.id === id);
}

export function getZodiacSignByDate(month: number, day: number): typeof zodiacSigns[number] | undefined {
  // 简化版日期判断，实际应该更精确
  const date = month * 100 + day;
  
  if (date >= 321 && date <= 419) return zodiacSigns[0]; // Aries
  if (date >= 420 && date <= 520) return zodiacSigns[1]; // Taurus
  if (date >= 521 && date <= 621) return zodiacSigns[2]; // Gemini
  if (date >= 622 && date <= 722) return zodiacSigns[3]; // Cancer
  if (date >= 723 && date <= 822) return zodiacSigns[4]; // Leo
  if (date >= 823 && date <= 922) return zodiacSigns[5]; // Virgo
  if (date >= 923 && date <= 1023) return zodiacSigns[6]; // Libra
  if (date >= 1024 && date <= 1122) return zodiacSigns[7]; // Scorpio
  if (date >= 1123 && date <= 1221) return zodiacSigns[8]; // Sagittarius
  if (date >= 1222 || date <= 119) return zodiacSigns[9]; // Capricorn
  if (date >= 120 && date <= 218) return zodiacSigns[10]; // Aquarius
  if (date >= 219 && date <= 320) return zodiacSigns[11]; // Pisces
  
  return undefined;
}

