import { ZodiacSignId } from './horoscope-data';

export interface PersonalityTraits {
  strengths: string[];
  weaknesses: string[];
  characteristics: string[];
  compatibility: string[];
  career: string[];
  love: string[];
}

const personalityData: Record<ZodiacSignId, { zh: PersonalityTraits; en: PersonalityTraits }> = {
  aries: {
    zh: {
      strengths: ['勇敢', '自信', '热情', '领导力强'],
      weaknesses: ['冲动', '缺乏耐心', '过于直接'],
      characteristics: ['充满活力', '喜欢挑战', '行动力强'],
      compatibility: ['狮子座', '射手座', '双子座'],
      career: ['企业家', '运动员', '军人', '销售'],
      love: ['热情直接', '喜欢主动追求', '需要自由空间'],
    },
    en: {
      strengths: ['Brave', 'Confident', 'Enthusiastic', 'Strong leadership'],
      weaknesses: ['Impulsive', 'Impatient', 'Too direct'],
      characteristics: ['Energetic', 'Loves challenges', 'Strong action'],
      compatibility: ['Leo', 'Sagittarius', 'Gemini'],
      career: ['Entrepreneur', 'Athlete', 'Military', 'Sales'],
      love: ['Passionate and direct', 'Likes to pursue actively', 'Needs freedom'],
    },
  },
  taurus: {
    zh: {
      strengths: ['稳重', '可靠', '有耐心', '务实'],
      weaknesses: ['固执', '过于保守', '缺乏灵活性'],
      characteristics: ['喜欢稳定', '重视物质', '享受生活'],
      compatibility: ['处女座', '摩羯座', '巨蟹座'],
      career: ['金融', '艺术', '农业', '房地产'],
      love: ['忠诚专一', '需要安全感', '喜欢稳定关系'],
    },
    en: {
      strengths: ['Stable', 'Reliable', 'Patient', 'Practical'],
      weaknesses: ['Stubborn', 'Too conservative', 'Lacks flexibility'],
      characteristics: ['Likes stability', 'Values material', 'Enjoys life'],
      compatibility: ['Virgo', 'Capricorn', 'Cancer'],
      career: ['Finance', 'Art', 'Agriculture', 'Real estate'],
      love: ['Loyal and devoted', 'Needs security', 'Likes stable relationships'],
    },
  },
  // 简化版，其他星座类似
  gemini: {
    zh: {
      strengths: ['聪明', '灵活', '好奇心强', '沟通能力强'],
      weaknesses: ['善变', '缺乏专注', '表面化'],
      characteristics: ['喜欢变化', '思维敏捷', '社交能力强'],
      compatibility: ['天秤座', '水瓶座', '狮子座'],
      career: ['媒体', '教育', '写作', '销售'],
      love: ['需要新鲜感', '喜欢交流', '不喜欢束缚'],
    },
    en: {
      strengths: ['Smart', 'Flexible', 'Curious', 'Strong communication'],
      weaknesses: ['Changeable', 'Lacks focus', 'Superficial'],
      characteristics: ['Likes change', 'Quick thinking', 'Strong social skills'],
      compatibility: ['Libra', 'Aquarius', 'Leo'],
      career: ['Media', 'Education', 'Writing', 'Sales'],
      love: ['Needs freshness', 'Likes communication', 'Dislikes constraints'],
    },
  },
  cancer: {
    zh: {
      strengths: ['情感丰富', '有同情心', '直觉强', '保护性强'],
      weaknesses: ['情绪化', '过于敏感', '缺乏安全感'],
      characteristics: ['重视家庭', '记忆力好', '喜欢怀旧'],
      compatibility: ['天蝎座', '双鱼座', '金牛座'],
      career: ['护理', '教育', '餐饮', '房地产'],
      love: ['情感细腻', '需要安全感', '重视承诺'],
    },
    en: {
      strengths: ['Emotional', 'Compassionate', 'Strong intuition', 'Protective'],
      weaknesses: ['Emotional', 'Too sensitive', 'Lacks security'],
      characteristics: ['Values family', 'Good memory', 'Likes nostalgia'],
      compatibility: ['Scorpio', 'Pisces', 'Taurus'],
      career: ['Nursing', 'Education', 'Catering', 'Real estate'],
      love: ['Emotionally delicate', 'Needs security', 'Values commitment'],
    },
  },
  leo: {
    zh: {
      strengths: ['自信', '慷慨', '有创造力', '领导力强'],
      weaknesses: ['自负', '需要关注', '过于骄傲'],
      characteristics: ['喜欢表现', '热情大方', '有魅力'],
      compatibility: ['白羊座', '射手座', '天秤座'],
      career: ['演艺', '管理', '设计', '教育'],
      love: ['热情浪漫', '喜欢被崇拜', '需要关注'],
    },
    en: {
      strengths: ['Confident', 'Generous', 'Creative', 'Strong leadership'],
      weaknesses: ['Arrogant', 'Needs attention', 'Too proud'],
      characteristics: ['Likes to perform', 'Enthusiastic', 'Charming'],
      compatibility: ['Aries', 'Sagittarius', 'Libra'],
      career: ['Entertainment', 'Management', 'Design', 'Education'],
      love: ['Passionate and romantic', 'Likes to be admired', 'Needs attention'],
    },
  },
  virgo: {
    zh: {
      strengths: ['细心', '有条理', '分析能力强', '追求完美'],
      weaknesses: ['过于挑剔', '焦虑', '缺乏自信'],
      characteristics: ['注重细节', '喜欢计划', '实用主义'],
      compatibility: ['金牛座', '摩羯座', '天蝎座'],
      career: ['医疗', '会计', '编辑', '研究'],
      love: ['谨慎认真', '需要时间了解', '重视细节'],
    },
    en: {
      strengths: ['Careful', 'Organized', 'Strong analysis', 'Pursues perfection'],
      weaknesses: ['Too picky', 'Anxious', 'Lacks confidence'],
      characteristics: ['Focuses on details', 'Likes planning', 'Pragmatic'],
      compatibility: ['Taurus', 'Capricorn', 'Scorpio'],
      career: ['Medical', 'Accounting', 'Editing', 'Research'],
      love: ['Cautious and serious', 'Needs time to understand', 'Values details'],
    },
  },
  libra: {
    zh: {
      strengths: ['平衡', '优雅', '有魅力', '社交能力强'],
      weaknesses: ['优柔寡断', '避免冲突', '过于依赖'],
      characteristics: ['追求和谐', '喜欢美', '重视关系'],
      compatibility: ['双子座', '水瓶座', '狮子座'],
      career: ['法律', '艺术', '设计', '公关'],
      love: ['浪漫优雅', '需要平衡', '重视伴侣'],
    },
    en: {
      strengths: ['Balanced', 'Elegant', 'Charming', 'Strong social skills'],
      weaknesses: ['Indecisive', 'Avoids conflict', 'Too dependent'],
      characteristics: ['Pursues harmony', 'Likes beauty', 'Values relationships'],
      compatibility: ['Gemini', 'Aquarius', 'Leo'],
      career: ['Law', 'Art', 'Design', 'PR'],
      love: ['Romantic and elegant', 'Needs balance', 'Values partner'],
    },
  },
  scorpio: {
    zh: {
      strengths: ['深刻', '有洞察力', '意志坚强', '忠诚'],
      weaknesses: ['多疑', '报复心强', '过于神秘'],
      characteristics: ['情感强烈', '喜欢探索', '有魅力'],
      compatibility: ['巨蟹座', '双鱼座', '摩羯座'],
      career: ['研究', '心理学', '侦探', '金融'],
      love: ['深情专一', '需要信任', '情感强烈'],
    },
    en: {
      strengths: ['Deep', 'Insightful', 'Strong will', 'Loyal'],
      weaknesses: ['Suspicious', 'Vindictive', 'Too mysterious'],
      characteristics: ['Strong emotions', 'Likes exploration', 'Charming'],
      compatibility: ['Cancer', 'Pisces', 'Capricorn'],
      career: ['Research', 'Psychology', 'Detective', 'Finance'],
      love: ['Deep and devoted', 'Needs trust', 'Strong emotions'],
    },
  },
  sagittarius: {
    zh: {
      strengths: ['乐观', '自由', '有冒险精神', '幽默'],
      weaknesses: ['缺乏耐心', '过于直接', '不够细致'],
      characteristics: ['喜欢旅行', '追求自由', '思想开放'],
      compatibility: ['白羊座', '狮子座', '水瓶座'],
      career: ['旅游', '教育', '哲学', '媒体'],
      love: ['自由独立', '需要空间', '不喜欢束缚'],
    },
    en: {
      strengths: ['Optimistic', 'Free', 'Adventurous', 'Humorous'],
      weaknesses: ['Impatient', 'Too direct', 'Not detailed'],
      characteristics: ['Likes travel', 'Pursues freedom', 'Open-minded'],
      compatibility: ['Aries', 'Leo', 'Aquarius'],
      career: ['Travel', 'Education', 'Philosophy', 'Media'],
      love: ['Free and independent', 'Needs space', 'Dislikes constraints'],
    },
  },
  capricorn: {
    zh: {
      strengths: ['有责任感', '务实', '有野心', '自律'],
      weaknesses: ['过于严肃', '缺乏幽默感', '工作狂'],
      characteristics: ['目标明确', '重视成就', '传统'],
      compatibility: ['金牛座', '处女座', '天蝎座'],
      career: ['管理', '金融', '工程', '政治'],
      love: ['认真负责', '需要时间', '重视稳定'],
    },
    en: {
      strengths: ['Responsible', 'Practical', 'Ambitious', 'Self-disciplined'],
      weaknesses: ['Too serious', 'Lacks humor', 'Workaholic'],
      characteristics: ['Clear goals', 'Values achievement', 'Traditional'],
      compatibility: ['Taurus', 'Virgo', 'Scorpio'],
      career: ['Management', 'Finance', 'Engineering', 'Politics'],
      love: ['Serious and responsible', 'Needs time', 'Values stability'],
    },
  },
  aquarius: {
    zh: {
      strengths: ['创新', '独立', '人道主义', '聪明'],
      weaknesses: ['情感疏离', '固执', '过于理想化'],
      characteristics: ['思想前卫', '喜欢自由', '重视友谊'],
      compatibility: ['双子座', '天秤座', '射手座'],
      career: ['科技', '科学', '社会服务', '创新'],
      love: ['需要自由', '重视友谊', '不喜欢束缚'],
    },
    en: {
      strengths: ['Innovative', 'Independent', 'Humanitarian', 'Smart'],
      weaknesses: ['Emotionally distant', 'Stubborn', 'Too idealistic'],
      characteristics: ['Forward-thinking', 'Likes freedom', 'Values friendship'],
      compatibility: ['Gemini', 'Libra', 'Sagittarius'],
      career: ['Technology', 'Science', 'Social service', 'Innovation'],
      love: ['Needs freedom', 'Values friendship', 'Dislikes constraints'],
    },
  },
  pisces: {
    zh: {
      strengths: ['有同情心', '有创造力', '直觉强', '艺术感强'],
      weaknesses: ['过于敏感', '逃避现实', '缺乏界限'],
      characteristics: ['情感丰富', '喜欢幻想', '有艺术天赋'],
      compatibility: ['巨蟹座', '天蝎座', '金牛座'],
      career: ['艺术', '音乐', '心理学', '护理'],
      love: ['浪漫敏感', '需要理解', '情感丰富'],
    },
    en: {
      strengths: ['Compassionate', 'Creative', 'Strong intuition', 'Artistic'],
      weaknesses: ['Too sensitive', 'Escapes reality', 'Lacks boundaries'],
      characteristics: ['Emotionally rich', 'Likes fantasy', 'Artistic talent'],
      compatibility: ['Cancer', 'Scorpio', 'Taurus'],
      career: ['Art', 'Music', 'Psychology', 'Nursing'],
      love: ['Romantic and sensitive', 'Needs understanding', 'Emotionally rich'],
    },
  },
};

export function getPersonalityTraits(
  signId: ZodiacSignId,
  locale: string = 'zh'
): PersonalityTraits {
  return personalityData[signId]?.[locale as 'zh' | 'en'] || personalityData[signId].zh;
}

