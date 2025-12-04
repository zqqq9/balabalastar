"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { HoroscopeContent } from '@/lib/horoscope-content-enhanced';

interface HoroscopeDisplayProps {
  horoscope: HoroscopeContent;
  locale: string;
}

export function HoroscopeDisplay({ horoscope, locale }: HoroscopeDisplayProps) {
  const isZh = locale === 'zh';

  const getScoreLabel = (score: number) => {
    if (score >= 5) return isZh ? '极佳' : 'Excellent';
    if (score >= 4) return isZh ? '良好' : 'Good';
    if (score >= 3) return isZh ? '一般' : 'Average';
    return isZh ? '需注意' : 'Need Attention';
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const categories = [
    {
      key: 'overall',
      label: isZh ? '综合运势' : 'Overall',
      score: horoscope.overall,
      description: horoscope.description.overall,
    },
    {
      key: 'love',
      label: isZh ? '爱情运势' : 'Love',
      score: horoscope.love,
      description: horoscope.description.love,
    },
    {
      key: 'career',
      label: isZh ? '事业运势' : 'Career',
      score: horoscope.career,
      description: horoscope.description.career,
    },
    {
      key: 'wealth',
      label: isZh ? '财运' : 'Wealth',
      score: horoscope.wealth,
      description: horoscope.description.wealth,
    },
    {
      key: 'health',
      label: isZh ? '健康运势' : 'Health',
      score: horoscope.health,
      description: horoscope.description.health,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 运势评分 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.key}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category.label}</CardTitle>
                <span className={`text-sm font-bold ${getScoreColor(category.score)}`}>
                  {getScoreLabel(category.score)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Progress value={(category.score / 5) * 100} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 建议 */}
      {horoscope.description.advice && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle>{isZh ? '今日建议' : 'Today\'s Advice'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {horoscope.description.advice}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 幸运数字和颜色 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{isZh ? '幸运数字' : 'Lucky Numbers'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {horoscope.luckyNumber.map((num, index) => (
                <div
                  key={index}
                  className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary"
                >
                  {num}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isZh ? '幸运颜色' : 'Lucky Colors'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {horoscope.luckyColor.map((color, index) => (
                <div
                  key={index}
                  className="px-4 py-2 rounded-md bg-primary/10 text-primary font-medium"
                >
                  {color}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

