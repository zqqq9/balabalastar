import { ZodiacSignId } from './horoscope-data';

// 星座配对兼容性矩阵（简化版）
const compatibilityMatrix: Record<ZodiacSignId, Record<ZodiacSignId, number>> = {
  aries: {
    aries: 70, taurus: 60, gemini: 80, cancer: 50, leo: 90, virgo: 55,
    libra: 75, scorpio: 65, sagittarius: 85, capricorn: 50, aquarius: 80, pisces: 55,
  },
  taurus: {
    aries: 60, taurus: 75, gemini: 55, cancer: 80, leo: 65, virgo: 85,
    libra: 70, scorpio: 75, sagittarius: 55, capricorn: 90, aquarius: 60, pisces: 80,
  },
  gemini: {
    aries: 80, taurus: 55, gemini: 75, cancer: 60, leo: 70, virgo: 65,
    libra: 85, scorpio: 60, sagittarius: 80, capricorn: 55, aquarius: 90, pisces: 60,
  },
  cancer: {
    aries: 50, taurus: 80, gemini: 60, cancer: 80, leo: 55, virgo: 75,
    libra: 65, scorpio: 85, sagittarius: 50, capricorn: 70, aquarius: 55, pisces: 90,
  },
  leo: {
    aries: 90, taurus: 65, gemini: 70, cancer: 55, leo: 85, virgo: 60,
    libra: 80, scorpio: 70, sagittarius: 85, capricorn: 60, aquarius: 75, pisces: 60,
  },
  virgo: {
    aries: 55, taurus: 85, gemini: 65, cancer: 75, leo: 60, virgo: 80,
    libra: 70, scorpio: 80, sagittarius: 60, capricorn: 85, aquarius: 65, pisces: 75,
  },
  libra: {
    aries: 75, taurus: 70, gemini: 85, cancer: 65, leo: 80, virgo: 70,
    libra: 80, scorpio: 70, sagittarius: 75, capricorn: 65, aquarius: 85, pisces: 70,
  },
  scorpio: {
    aries: 65, taurus: 75, gemini: 60, cancer: 85, leo: 70, virgo: 80,
    libra: 70, scorpio: 85, sagittarius: 65, capricorn: 75, aquarius: 60, pisces: 90,
  },
  sagittarius: {
    aries: 85, taurus: 55, gemini: 80, cancer: 50, leo: 85, virgo: 60,
    libra: 75, scorpio: 65, sagittarius: 80, capricorn: 55, aquarius: 85, pisces: 60,
  },
  capricorn: {
    aries: 50, taurus: 90, gemini: 55, cancer: 70, leo: 60, virgo: 85,
    libra: 65, scorpio: 75, sagittarius: 55, capricorn: 85, aquarius: 60, pisces: 75,
  },
  aquarius: {
    aries: 80, taurus: 60, gemini: 90, cancer: 55, leo: 75, virgo: 65,
    libra: 85, scorpio: 60, sagittarius: 85, capricorn: 60, aquarius: 80, pisces: 65,
  },
  pisces: {
    aries: 55, taurus: 80, gemini: 60, cancer: 90, leo: 60, virgo: 75,
    libra: 70, scorpio: 90, sagittarius: 60, capricorn: 75, aquarius: 65, pisces: 85,
  },
};

export function getCompatibilityScore(
  sign1: ZodiacSignId,
  sign2: ZodiacSignId
): number {
  return compatibilityMatrix[sign1]?.[sign2] || 50;
}

export function getCompatibilityDescription(
  score: number,
  locale: string = 'zh'
): string {
  if (locale === 'zh') {
    if (score >= 85) return '非常匹配！你们是天作之合，相互理解，关系和谐。';
    if (score >= 75) return '很匹配！你们有很多共同点，相处愉快。';
    if (score >= 65) return '比较匹配。虽然有些差异，但可以通过沟通解决。';
    if (score >= 55) return '一般匹配。需要更多努力来维持关系。';
    return '不太匹配。可能需要更多耐心和理解。';
  } else {
    if (score >= 85) return 'Excellent match! You are a perfect pair with mutual understanding and harmony.';
    if (score >= 75) return 'Great match! You have many things in common and get along well.';
    if (score >= 65) return 'Good match. Although there are some differences, they can be resolved through communication.';
    if (score >= 55) return 'Average match. More effort is needed to maintain the relationship.';
    return 'Low match. More patience and understanding may be needed.';
  }
}

