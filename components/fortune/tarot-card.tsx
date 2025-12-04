"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TarotCard } from '@/lib/tarot-cards-complete';
import { getCardMeaning } from '@/lib/tarot-cards-complete';
import { getTarotImagePath } from '@/lib/tarot-image-map';
import { Sparkles, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TarotCardProps {
  card: TarotCard;
  index: number;
  position?: string;
  locale?: string;
  className?: string;
}

export function TarotCardComponent({ card, index, position, locale = 'zh', className }: TarotCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const isZh = locale === 'zh';
  const meaning = getCardMeaning(card, locale);
  
  // 使用稳定的图片路径映射
  const imagePath = getTarotImagePath(card.id);
  
  // 调试信息（开发环境）
  if (process.env.NODE_ENV === 'development') {
    // 确保卡片ID和图片路径匹配
    if (card.id < 0 || card.id > 77) {
      console.warn(`无效的卡片ID: ${card.id}`, card);
    }
  }

  return (
    <div className={cn("relative w-full", className)}>
      <Card
        className={cn(
          "relative w-full transition-all duration-300 cursor-pointer group",
          "hover:shadow-lg hover:scale-[1.02]",
          card.reversed && "border-orange-500 border-2"
        )}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* 卡片正面 */}
        <div
          className={cn(
            "transition-opacity duration-300",
            isFlipped ? "opacity-0 absolute inset-0 pointer-events-none" : "opacity-100"
          )}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg md:text-xl">
                  {isZh ? card.nameZh : card.nameEn}
                </CardTitle>
                {card.suit && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.suit} {card.number !== undefined ? `(${card.number})` : ''}
                  </p>
                )}
                {position && (
                  <p className="text-xs text-primary mt-1 font-medium">
                    {position}
                  </p>
                )}
              </div>
              <Badge variant={card.reversed ? 'destructive' : 'default'} className="ml-2">
                {card.reversed ? (isZh ? '逆位' : 'Reversed') : (isZh ? '正位' : 'Upright')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative w-full aspect-[2/3] bg-muted/20 mb-3 overflow-hidden rounded-lg border border-border/50">
              {imageLoading && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/50 rounded-lg">
                  <Sparkles className="h-8 w-8 text-primary opacity-30 animate-pulse" />
                </div>
              )}
              {!imageError ? (
                <Image
                  src={imagePath}
                  alt={isZh ? card.nameZh : card.nameEn}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={cn(
                    "object-contain transition-all duration-300",
                    card.reversed && "rotate-180",
                    imageLoading ? "opacity-0" : "opacity-100"
                  )}
                  onLoad={() => {
                    setImageLoading(false);
                    setImageError(false);
                  }}
                  onError={(e) => {
                    setImageError(true);
                    setImageLoading(false);
                    console.error('图片加载失败:', {
                      cardId: card.id,
                      cardName: card.nameZh,
                      imagePath,
                      error: e
                    });
                  }}
                  unoptimized
                  priority={index < 3}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/30 rounded-lg">
                  <Sparkles className="h-12 w-12 text-primary opacity-50" />
                  <p className="text-xs text-muted-foreground mt-2 text-center px-2">
                    {isZh ? '图片加载失败' : 'Image load failed'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 opacity-50 text-center px-2 break-all">
                    {imagePath}
                  </p>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {meaning}
            </p>
            <p className="text-xs text-muted-foreground mt-2 opacity-70">
              {isZh ? '点击翻转查看详情' : 'Click to flip for details'}
            </p>
          </CardContent>
        </div>

        {/* 卡片背面（详细信息） */}
        <div
          className={cn(
            "transition-opacity duration-300",
            !isFlipped ? "opacity-0 absolute inset-0 pointer-events-none" : "opacity-100"
          )}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg md:text-xl">
                {isZh ? card.nameZh : card.nameEn}
              </CardTitle>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="p-1 hover:bg-accent rounded"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 卡片图片 */}
            <div className="relative w-full aspect-[2/3] bg-muted/20 overflow-hidden rounded-lg border border-border/50">
              {imageLoading && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/50 rounded-lg">
                  <Sparkles className="h-8 w-8 text-primary opacity-30 animate-pulse" />
                </div>
              )}
              {!imageError ? (
                <Image
                  src={imagePath}
                  alt={isZh ? card.nameZh : card.nameEn}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={cn(
                    "object-contain transition-all duration-300",
                    card.reversed && "rotate-180",
                    imageLoading ? "opacity-0" : "opacity-100"
                  )}
                  onLoad={() => {
                    setImageLoading(false);
                    setImageError(false);
                  }}
                  onError={(e) => {
                    setImageError(true);
                    setImageLoading(false);
                    console.error('图片加载失败:', {
                      cardId: card.id,
                      cardName: card.nameZh,
                      imagePath,
                      error: e
                    });
                  }}
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/30 rounded-lg">
                  <Sparkles className="h-12 w-12 text-primary opacity-50" />
                  <p className="text-xs text-muted-foreground mt-2 text-center px-2">
                    {isZh ? '图片加载失败' : 'Image load failed'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 opacity-50 text-center px-2 break-all">
                    {imagePath}
                  </p>
                </div>
              )}
            </div>
            
            {card.suit && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">{isZh ? '花色' : 'Suit'}: </span>
                {card.suit} {card.number !== undefined ? `(${card.number})` : ''}
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Badge variant="default" className="text-xs">
                  {isZh ? '正位' : 'Upright'}
                </Badge>
                {isZh ? '正位含义' : 'Upright Meaning'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {card.meaning}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Badge variant="destructive" className="text-xs">
                  {isZh ? '逆位' : 'Reversed'}
                </Badge>
                {isZh ? '逆位含义' : 'Reversed Meaning'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {card.reversedMeaning}
              </p>
            </div>

            {card.reversed && (
              <div className="pt-2 border-t">
                <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                  {isZh ? '当前为逆位' : 'Currently Reversed'}
                </p>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

