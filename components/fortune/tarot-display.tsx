"use client";

import { useTranslations } from 'next-intl';
import type { TarotCard } from '@/lib/tarot-cards-complete';
import { spreadPositions, type TarotSpread } from '@/lib/tarot-cards-complete';
import { TarotCardComponent } from './tarot-card';

interface TarotDisplayProps {
  cards: TarotCard[];
  spread: TarotSpread;
  locale?: string;
}

export function TarotDisplay({ cards, spread, locale = 'zh' }: TarotDisplayProps) {
  const t = useTranslations('fortune');
  const isZh = locale === 'zh';
  const positions = spreadPositions[spread];

  // 根据牌阵类型调整布局
  const getGridClass = () => {
    switch (spread) {
      case 'single':
        return 'grid-cols-1 max-w-xs mx-auto';
      case 'three':
        return 'grid-cols-1 md:grid-cols-3 gap-6';
      case 'five':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    }
  };

  return (
    <div className={`grid ${getGridClass()}`}>
      {cards.map((card, index) => {
        const position = positions[index];
        const positionText = position 
          ? (isZh ? position.zh : position.en)
          : t('cardNumber', { number: index + 1 });

        return (
          <TarotCardComponent
            key={index}
            card={card}
            index={index}
            position={positionText}
            locale={locale}
            className="w-full"
          />
        );
      })}
    </div>
  );
}

