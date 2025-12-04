// 完整的78张塔罗牌数据

export interface TarotCard {
  id: number;
  nameZh: string;
  nameEn: string;
  suit?: string; // 小阿卡纳的花色
  number?: number; // 小阿卡纳的数字
  meaning: string; // 正位含义
  reversedMeaning: string; // 逆位含义
  reversed: boolean; // 是否逆位
}

// 大阿卡纳（22张）
const majorArcana: Omit<TarotCard, 'reversed'>[] = [
  { id: 0, nameZh: '愚者', nameEn: 'The Fool', meaning: '新的开始、冒险精神、纯真', reversedMeaning: '鲁莽、缺乏计划、不成熟' },
  { id: 1, nameZh: '魔术师', nameEn: 'The Magician', meaning: '创造力、行动力、自信', reversedMeaning: '缺乏行动、欺骗、滥用权力' },
  { id: 2, nameZh: '女祭司', nameEn: 'The High Priestess', meaning: '直觉、神秘、内在智慧', reversedMeaning: '缺乏直觉、秘密、压抑' },
  { id: 3, nameZh: '皇后', nameEn: 'The Empress', meaning: '丰盛、母性、创造力', reversedMeaning: '依赖、缺乏成长、过度保护' },
  { id: 4, nameZh: '皇帝', nameEn: 'The Emperor', meaning: '权威、稳定、领导力', reversedMeaning: '专制、缺乏纪律、滥用权力' },
  { id: 5, nameZh: '教皇', nameEn: 'The Hierophant', meaning: '传统、指导、精神追求', reversedMeaning: '反传统、缺乏指导、个人信仰' },
  { id: 6, nameZh: '恋人', nameEn: 'The Lovers', meaning: '爱情、选择、和谐', reversedMeaning: '不和谐、错误选择、缺乏沟通' },
  { id: 7, nameZh: '战车', nameEn: 'The Chariot', meaning: '胜利、控制、决心', reversedMeaning: '缺乏控制、失败、缺乏方向' },
  { id: 8, nameZh: '力量', nameEn: 'Strength', meaning: '内在力量、耐心、勇气', reversedMeaning: '软弱、缺乏耐心、自我怀疑' },
  { id: 9, nameZh: '隐者', nameEn: 'The Hermit', meaning: '内省、寻求真理、指导', reversedMeaning: '孤立、缺乏指导、迷失方向' },
  { id: 10, nameZh: '命运之轮', nameEn: 'Wheel of Fortune', meaning: '变化、循环、命运', reversedMeaning: '坏运气、缺乏控制、抗拒变化' },
  { id: 11, nameZh: '正义', nameEn: 'Justice', meaning: '平衡、公正、责任', reversedMeaning: '不公正、缺乏责任、不平衡' },
  { id: 12, nameZh: '倒吊人', nameEn: 'The Hanged Man', meaning: '牺牲、等待、新视角', reversedMeaning: '拖延、不必要的牺牲、抗拒' },
  { id: 13, nameZh: '死神', nameEn: 'Death', meaning: '结束、转变、重生', reversedMeaning: '抗拒变化、停滞、无法前进' },
  { id: 14, nameZh: '节制', nameEn: 'Temperance', meaning: '平衡、调和、耐心', reversedMeaning: '不平衡、缺乏调和、急躁' },
  { id: 15, nameZh: '恶魔', nameEn: 'The Devil', meaning: '束缚、欲望、物质主义', reversedMeaning: '解脱、克服束缚、精神自由' },
  { id: 16, nameZh: '塔', nameEn: 'The Tower', meaning: '破坏、启示、突然变化', reversedMeaning: '避免灾难、内在变化、抗拒变化' },
  { id: 17, nameZh: '星星', nameEn: 'The Star', meaning: '希望、灵感、精神指引', reversedMeaning: '缺乏希望、绝望、失去信心' },
  { id: 18, nameZh: '月亮', nameEn: 'The Moon', meaning: '恐惧、幻觉、潜意识', reversedMeaning: '克服恐惧、清晰、内在平静' },
  { id: 19, nameZh: '太阳', nameEn: 'The Sun', meaning: '快乐、成功、活力', reversedMeaning: '过度自信、缺乏活力、暂时困难' },
  { id: 20, nameZh: '审判', nameEn: 'Judgement', meaning: '重生、觉醒、宽恕', reversedMeaning: '缺乏自我反省、无法前进、自我怀疑' },
  { id: 21, nameZh: '世界', nameEn: 'The World', meaning: '完成、成就、圆满', reversedMeaning: '未完成、缺乏成就感、延迟' },
];

// 小阿卡纳花色
const suits = [
  { nameZh: '权杖', nameEn: 'Wands', element: '火' },
  { nameZh: '圣杯', nameEn: 'Cups', element: '水' },
  { nameZh: '宝剑', nameEn: 'Swords', element: '风' },
  { nameZh: '星币', nameEn: 'Pentacles', element: '土' },
];

// 数字牌含义（通用）
const numberMeanings: Record<number, { zh: string; en: string; reversedZh: string; reversedEn: string }> = {
  1: { zh: '开始、新机会', en: 'Beginning, new opportunity', reversedZh: '虚假开始、错失机会', reversedEn: 'False start, missed opportunity' },
  2: { zh: '平衡、合作', en: 'Balance, cooperation', reversedZh: '不平衡、缺乏合作', reversedEn: 'Imbalance, lack of cooperation' },
  3: { zh: '创造力、表达', en: 'Creativity, expression', reversedZh: '缺乏创造力、沟通困难', reversedEn: 'Lack of creativity, communication difficulties' },
  4: { zh: '稳定、基础', en: 'Stability, foundation', reversedZh: '不稳定、缺乏基础', reversedEn: 'Instability, lack of foundation' },
  5: { zh: '冲突、变化', en: 'Conflict, change', reversedZh: '解决冲突、接受变化', reversedEn: 'Resolving conflict, accepting change' },
  6: { zh: '和谐、平衡', en: 'Harmony, balance', reversedZh: '不和谐、不平衡', reversedEn: 'Disharmony, imbalance' },
  7: { zh: '挑战、测试', en: 'Challenge, test', reversedZh: '克服挑战、通过测试', reversedEn: 'Overcoming challenge, passing test' },
  8: { zh: '行动、进展', en: 'Action, progress', reversedZh: '缺乏行动、停滞', reversedEn: 'Lack of action, stagnation' },
  9: { zh: '接近完成', en: 'Near completion', reversedZh: '延迟、未完成', reversedEn: 'Delay, incomplete' },
  10: { zh: '完成、圆满', en: 'Completion, fulfillment', reversedZh: '未完成、缺乏满足', reversedEn: 'Incomplete, lack of fulfillment' },
};

// 宫廷牌
const courtCards = [
  { nameZh: '侍从', nameEn: 'Page', meaning: '学习、新开始', reversedMeaning: '缺乏经验、不成熟' },
  { nameZh: '骑士', nameEn: 'Knight', meaning: '行动、冒险', reversedMeaning: '冲动、缺乏方向' },
  { nameZh: '皇后', nameEn: 'Queen', meaning: '成熟、滋养', reversedMeaning: '过度保护、缺乏边界' },
  { nameZh: '国王', nameEn: 'King', meaning: '权威、领导', reversedMeaning: '专制、缺乏同情心' },
];

// 生成小阿卡纳牌
function generateMinorArcana(): Omit<TarotCard, 'reversed'>[] {
  const cards: Omit<TarotCard, 'reversed'>[] = [];
  let id = 22;

  // 每个花色的数字牌（1-10）
  suits.forEach((suit) => {
    for (let num = 1; num <= 10; num++) {
      const meaning = numberMeanings[num];
      cards.push({
        id: id++,
        nameZh: `${suit.nameZh}${num}`,
        nameEn: `${suit.nameEn} ${num}`,
        suit: suit.nameZh,
        number: num,
        meaning: meaning.zh,
        reversedMeaning: meaning.reversedZh,
      });
    }

    // 每个花色的宫廷牌
    courtCards.forEach((court) => {
      cards.push({
        id: id++,
        nameZh: `${suit.nameZh}${court.nameZh}`,
        nameEn: `${suit.nameEn} ${court.nameEn}`,
        suit: suit.nameZh,
        meaning: court.meaning,
        reversedMeaning: court.reversedMeaning,
      });
    });
  });

  return cards;
}

// 完整的78张塔罗牌
export const allTarotCards: Omit<TarotCard, 'reversed'>[] = [
  ...majorArcana,
  ...generateMinorArcana(),
];

// 根据ID获取塔罗牌
export function getTarotCardById(id: number, reversed: boolean = false): TarotCard {
  const card = allTarotCards.find(c => c.id === id);
  if (!card) {
    throw new Error(`Tarot card with id ${id} not found`);
  }
  return { ...card, reversed };
}

// 抽塔罗牌（增强版）
export function drawTarotCards(count: number = 1): TarotCard[] {
  const drawn: TarotCard[] = [];
  const used = new Set<number>();

  for (let i = 0; i < count; i++) {
    let cardIndex;
    do {
      cardIndex = Math.floor(Math.random() * allTarotCards.length);
    } while (used.has(cardIndex));
    
    used.add(cardIndex);
    // 直接使用数组索引获取卡片，确保ID正确
    const cardData = allTarotCards[cardIndex];
    const card: TarotCard = {
      ...cardData,
      reversed: Math.random() > 0.5, // 随机决定是否逆位
    };
    drawn.push(card);
  }

  return drawn;
}

// 获取牌意（根据正逆位）
export function getCardMeaning(card: TarotCard, locale: string = 'zh'): string {
  if (locale === 'en') {
    // 英文含义（简化版，实际应该从数据中获取）
    return card.reversed ? card.reversedMeaning : card.meaning;
  }
  // 中文含义
  return card.reversed ? card.reversedMeaning : card.meaning;
}

// 牌阵类型
export type TarotSpread = 'single' | 'three' | 'five';

// 牌阵位置标签
export const spreadPositions: Record<TarotSpread, Record<number, { zh: string; en: string }>> = {
  single: {
    0: { zh: '牌意', en: 'Meaning' },
  },
  three: {
    0: { zh: '过去', en: 'Past' },
    1: { zh: '现在', en: 'Present' },
    2: { zh: '未来', en: 'Future' },
  },
  five: {
    0: { zh: '现状', en: 'Situation' },
    1: { zh: '挑战', en: 'Challenge' },
    2: { zh: '过去', en: 'Past' },
    3: { zh: '未来', en: 'Future' },
    4: { zh: '建议', en: 'Advice' },
  },
};
