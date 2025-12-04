"use client";

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { drawTarotCards, type TarotCard, type TarotSpread } from '@/lib/tarot-cards-complete';
import { TarotDisplay } from '@/components/fortune/tarot-display';
import { Sparkles, Wand2, RotateCcw, BookOpen, Loader2 } from 'lucide-react';
import { useLocale } from 'next-intl';

interface InterpretationResult {
  summary: string;
  detailed: string;
  advice: string;
}

export default function TarotPage() {
  const t = useTranslations('fortune');
  const locale = useLocale();
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [spread, setSpread] = useState<TarotSpread>('single');
  const [question, setQuestion] = useState('');
  const [interpretation, setInterpretation] = useState<InterpretationResult | null>(null);
  const [isLoadingInterpretation, setIsLoadingInterpretation] = useState(false);
  const [interpretationError, setInterpretationError] = useState<string | null>(null);

  const getCardCount = (spreadType: TarotSpread): number => {
    switch (spreadType) {
      case 'single':
        return 1;
      case 'three':
        return 3;
      case 'five':
        return 5;
      default:
        return 1;
    }
  };

  const handleDraw = () => {
    const count = getCardCount(spread);
    setIsDrawing(true);
    setInterpretation(null); // 清空之前的解答
    setInterpretationError(null);
    
    // 添加抽牌动画延迟
    setTimeout(() => {
      const drawnCards = drawTarotCards(count);
      setCards(drawnCards);
      setIsDrawing(false);
    }, 800);
  };

  const handleSpreadChange = (newSpread: TarotSpread) => {
    setSpread(newSpread);
    setCards([]); // 清空之前的牌
    setInterpretation(null); // 清空解答
    setInterpretationError(null);
  };

  const handleGetInterpretation = async () => {
    if (cards.length === 0) {
      console.warn('没有卡片，无法获取解答');
      return;
    }
    
    console.log('开始获取大师解答，卡片数:', cards.length, '牌阵:', spread);
    setIsLoadingInterpretation(true);
    setInterpretationError(null);
    
    try {
      const requestBody = {
        cards,
        question: question || undefined,
        spread,
        locale, // 传递语言设置
      };
      
      console.log('发送请求到 /api/fortune/tarot/interpretation', requestBody);
      
      const response = await fetch('/api/fortune/tarot/interpretation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('API响应状态:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API响应错误:', response.status, errorText);
        setInterpretationError(locale === 'zh' ? `请求失败: ${response.status}` : `Request failed: ${response.status}`);
        return;
      }

      const data = await response.json();
      console.log('API返回数据:', data);

      if (data.success && data.data) {
        setInterpretation(data.data);
        console.log('成功获取解答');
      } else {
        console.error('API返回失败:', data);
        setInterpretationError(data.error?.message || (locale === 'zh' ? '获取解答失败，请稍后重试' : 'Failed to get interpretation, please try again'));
      }
    } catch (error) {
      console.error('获取大师解答失败:', error);
      setInterpretationError(locale === 'zh' ? `网络错误: ${error instanceof Error ? error.message : '未知错误'}` : `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoadingInterpretation(false);
    }
  };

  const spreads = [
    {
      id: 'single' as TarotSpread,
      name: t('spreadSingle'),
      description: t('spreadSingleDesc'),
      icon: Sparkles,
    },
    {
      id: 'three' as TarotSpread,
      name: t('spreadThree'),
      description: t('spreadThreeDesc'),
      icon: Wand2,
    },
    {
      id: 'five' as TarotSpread,
      name: t('spreadFive'),
      description: t('spreadFiveDesc'),
      icon: Wand2,
    },
  ];

  return (
    <div className="container mx-auto py-12 md:py-16 px-4">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="gradient-text">{t('tarot')}</span>
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            {t('tarotDescription')}
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          {/* 问题输入 */}
          <Card>
            <CardHeader>
              <CardTitle>{t('enterQuestion')}</CardTitle>
              <CardDescription>
                {locale === 'zh' 
                  ? '静心思考您的问题，然后抽取塔罗牌'
                  : 'Think about your question, then draw tarot cards'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label htmlFor="question" className="text-sm font-medium">
                  {t('enterQuestion')}
                </label>
                <Input
                  id="question"
                  placeholder={t('questionPlaceholder')}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="max-w-2xl"
                />
              </div>
            </CardContent>
          </Card>

          {/* 牌阵选择 */}
          <Card>
            <CardHeader>
              <CardTitle>{t('selectSpread')}</CardTitle>
              <CardDescription>
                {t('selectCardCount')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {spreads.map((spreadOption) => {
                  const Icon = spreadOption.icon;
                  const isSelected = spread === spreadOption.id;
                  
                  return (
                    <button
                      key={spreadOption.id}
                      onClick={() => handleSpreadChange(spreadOption.id)}
                      className={`
                        relative p-6 rounded-lg border-2 transition-all text-left
                        ${isSelected 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-border hover:border-primary/50 hover:bg-accent/50'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`
                          p-2 rounded-md
                          ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                        `}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">
                            {spreadOption.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {spreadOption.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {getCardCount(spreadOption.id)} {locale === 'zh' ? '张牌' : 'cards'}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 抽牌按钮 */}
          <div className="flex justify-center">
            <Button
              onClick={handleDraw}
              disabled={isDrawing}
              size="lg"
              className="min-w-[200px]"
            >
              {isDrawing ? (
                <>
                  <RotateCcw className="h-5 w-5 mr-2 animate-spin" />
                  {t('drawing')}
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  {t('drawCard')}
                </>
              )}
            </Button>
          </div>

          {/* 显示抽到的牌 */}
          {cards.length > 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* 结果标题 */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">{t('cardMeaning')}</h2>
                  {question && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {locale === 'zh' ? '您的问题：' : 'Your question: '}
                      <span className="text-foreground font-medium">{question}</span>
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleDraw}
                  variant="outline"
                  disabled={isDrawing}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {t('drawAgain')}
                </Button>
              </div>

              {/* 牌阵说明 */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    {spread === 'single' && (
                      locale === 'zh' 
                        ? '单张牌占卜适合快速了解当前情况或问题的核心。'
                        : 'Single card divination is suitable for quickly understanding the current situation or the core of the question.'
                    )}
                    {spread === 'three' && (
                      locale === 'zh'
                        ? '三牌阵从左到右分别代表过去、现在和未来，帮助您了解事情的发展脉络。'
                        : 'The three-card spread represents past, present, and future from left to right, helping you understand the development of things.'
                    )}
                    {spread === 'five' && (
                      locale === 'zh'
                        ? '五牌阵提供更全面的占卜，包含现状、挑战、过去、未来和建议五个方面。'
                        : 'The five-card spread provides more comprehensive divination, including situation, challenge, past, future, and advice.'
                    )}
                  </p>
                </CardContent>
              </Card>

              {/* 塔罗牌显示 */}
              <TarotDisplay cards={cards} spread={spread} locale={locale} />

              {/* 大师解答按钮 */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleGetInterpretation}
                  disabled={isLoadingInterpretation}
                  size="lg"
                  className="min-w-[200px]"
                >
                  {isLoadingInterpretation ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      {locale === 'zh' ? '正在获取解答...' : 'Getting interpretation...'}
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-5 w-5 mr-2" />
                      {locale === 'zh' ? '大师解答' : 'Master Interpretation'}
                    </>
                  )}
                </Button>
              </div>

              {/* 大师解答结果 */}
              {interpretation && (
                <Card className="mt-6 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      {locale === 'zh' ? '大师解答' : 'Master Interpretation'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-primary">
                        {locale === 'zh' ? '摘要' : 'Summary'}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {interpretation.summary}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-primary">
                        {locale === 'zh' ? '详细解读' : 'Detailed Interpretation'}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {interpretation.detailed}
                      </p>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-semibold mb-2 text-primary">
                        {locale === 'zh' ? '建议' : 'Advice'}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {interpretation.advice}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 错误提示 */}
              {interpretationError && (
                <Card className="mt-6 border-destructive/20 bg-destructive/5">
                  <CardContent className="pt-6">
                    <p className="text-sm text-destructive text-center">
                      {interpretationError}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* 抽牌动画提示 */}
          {isDrawing && (
            <div className="text-center py-12">
              <div className="inline-flex flex-col items-center gap-4">
                <div className="relative">
                  <Sparkles className="h-12 w-12 text-primary animate-pulse" />
                  <RotateCcw className="h-6 w-6 text-primary absolute -top-1 -right-1 animate-spin" />
                </div>
                <p className="text-muted-foreground">{t('drawing')}</p>
                <p className="text-xs text-muted-foreground">
                  {locale === 'zh' ? '正在为您抽取塔罗牌...' : 'Drawing tarot cards for you...'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
