/**
 * 塔罗牌图片映射表
 * 使用ID直接映射，确保图片路径稳定可靠
 */

// 根据ID直接映射图片文件名
export const tarotImageMap: Record<number, string> = {
  // 大阿卡纳 0-21
  0: '00-愚者.webp',
  1: '01-魔术师.webp',
  2: '02-女祭司.webp',
  3: '03-皇后.webp',
  4: '04-皇帝.webp',
  5: '05-教皇.webp',
  6: '06-恋人.webp',
  7: '07-战车.webp',
  8: '08-力量.webp',
  9: '09-隐者.webp',
  10: '10-命运之轮.webp',
  11: '11-正义.webp',
  12: '12-倒吊人.webp',
  13: '13-死神.webp',
  14: '14-节制.webp',
  15: '15-恶魔.webp',
  16: '16-塔.webp',
  17: '17-星星.webp',
  18: '18-月亮.webp',
  19: '19-太阳.webp',
  20: '20-审判.webp',
  21: '21-世界.webp',
  // 小阿卡纳 - 权杖 22-35
  22: '22-权杖1.webp',
  23: '23-权杖2.webp',
  24: '24-权杖3.webp',
  25: '25-权杖4.webp',
  26: '26-权杖5.webp',
  27: '27-权杖6.webp',
  28: '28-权杖7.webp',
  29: '29-权杖8.webp',
  30: '30-权杖9.webp',
  31: '31-权杖10.webp',
  32: '32-权杖侍从.webp',
  33: '33-权杖骑士.webp',
  34: '34-权杖皇后.webp',
  35: '35-权杖国王.webp',
  // 小阿卡纳 - 圣杯 36-49
  36: '36-圣杯1.webp',
  37: '37-圣杯2.webp',
  38: '38-圣杯3.webp',
  39: '39-圣杯4.webp',
  40: '40-圣杯5.webp',
  41: '41-圣杯6.webp',
  42: '42-圣杯7.webp',
  43: '43-圣杯8.webp',
  44: '44-圣杯9.webp',
  45: '45-圣杯10.webp',
  46: '46-圣杯侍从.webp',
  47: '47-圣杯骑士.webp',
  48: '48-圣杯皇后.webp',
  49: '49-圣杯国王.webp',
  // 小阿卡纳 - 宝剑 50-63
  50: '50-宝剑1.webp',
  51: '51-宝剑2.webp',
  52: '52-宝剑3.webp',
  53: '53-宝剑4.webp',
  54: '54-宝剑5.webp',
  55: '55-宝剑6.webp',
  56: '56-宝剑7.webp',
  57: '57-宝剑8.webp',
  58: '58-宝剑9.webp',
  59: '59-宝剑10.webp',
  60: '60-宝剑侍从.webp',
  61: '61-宝剑骑士.webp',
  62: '62-宝剑皇后.webp',
  63: '63-宝剑国王.webp',
  // 小阿卡纳 - 星币 64-77
  64: '64-星币1.webp',
  65: '65-星币2.webp',
  66: '66-星币3.webp',
  67: '67-星币4.webp',
  68: '68-星币5.webp',
  69: '69-星币6.webp',
  70: '70-星币7.webp',
  71: '71-星币8.webp',
  72: '72-星币9.webp',
  73: '73-星币10.webp',
  74: '74-星币侍从.webp',
  75: '75-星币骑士.webp',
  76: '76-星币皇后.webp',
  77: '77-星币国王.webp',
};

/**
 * 根据塔罗牌ID获取图片路径
 * @param cardId 塔罗牌ID (0-77)
 * @returns 图片路径
 */
export function getTarotImagePath(cardId: number): string {
  const filename = tarotImageMap[cardId];
  if (!filename) {
    console.warn(`未找到ID为 ${cardId} 的塔罗牌图片映射`);
    return `/images/tarot/00-愚者.webp`; // 默认返回第一张图片
  }
  return `/images/tarot/${filename}`;
}

