"use client";

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { calculateBazi, getZodiac } from '@/lib/bazi-calculator';
import type { BaziResult } from '@/lib/fortune-data';
import { Sparkles, Calendar, Clock, RotateCcw } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Badge } from '@/components/ui/badge';

export default function BaziPage() {
  const t = useTranslations('fortune');
  const locale = useLocale();
  const isZh = locale === 'zh';
  
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [result, setResult] = useState<BaziResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    if (!birthDate || !birthTime) {
      setError(t('pleaseSelectDate'));
      return;
    }

    setIsCalculating(true);
    setError('');

    try {
      // 解析日期和时间
      const date = new Date(birthDate);
      if (isNaN(date.getTime())) {
        setError(t('invalidDate'));
        setIsCalculating(false);
        return;
      }

      // 解析时间（HH:MM格式）
      const [hours, minutes] = birthTime.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60) {
        setError(isZh ? '时间格式无效' : 'Invalid time format');
        setIsCalculating(false);
        return;
      }

      // 设置时间到日期对象
      date.setHours(hours, minutes, 0, 0);

      // 延迟一下，显示计算动画
      setTimeout(() => {
        const baziResult = calculateBazi(date, hours, locale);
        setResult(baziResult);
        setIsCalculating(false);
      }, 500);
    } catch (err) {
      setError(isZh ? '计算出错，请重试' : 'Calculation error, please try again');
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setBirthDate('');
    setBirthTime('');
    setResult(null);
    setError('');
  };

  const getWuxingColor = (element: string) => {
    const colors: Record<string, string> = {
      '金': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      '木': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      '水': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      '火': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      '土': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      'Metal': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'Wood': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Water': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Fire': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'Earth': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    };
    return colors[element] || 'bg-muted text-muted-foreground';
  };

  const year = birthDate ? new Date(birthDate).getFullYear() : null;
  const zodiac = year ? getZodiac(year) : null;

  return (
    <div className="container mx-auto py-12 md:py-16 px-4">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="gradient-text">{t('baziTitle')}</span>
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            {t('baziSubtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* 输入表单 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t('inputBirthDate')}
              </CardTitle>
              <CardDescription>
                {isZh ? '请输入您的出生日期和时间（24小时制）' : 'Please enter your birth date and time (24-hour format)'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="birthDate" className="text-sm font-medium">
                    {t('birthDate')}
                  </label>
                  <input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="birthTime" className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t('birthTime')}
                  </label>
                  <input
                    id="birthTime"
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={handleCalculate}
                  disabled={isCalculating || !birthDate || !birthTime}
                  size="lg"
                  className="flex-1"
                >
                  {isCalculating ? (
                    <>
                      <RotateCcw className="h-5 w-5 mr-2 animate-spin" />
                      {t('calculating')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      {t('calculate')}
                    </>
                  )}
                </Button>
                {result && (
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="lg"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {t('calculateAgain')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 结果显示 */}
          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* 八字四柱 */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('baziResult')}</CardTitle>
                  {zodiac && (
                    <CardDescription>
                      {isZh ? '生肖：' : 'Zodiac: '}
                      <Badge variant="secondary" className="ml-2">{zodiac}</Badge>
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">{t('yearPillar')}</div>
                      <div className="text-2xl font-bold">{result.yearGanZhi}</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">{t('monthPillar')}</div>
                      <div className="text-2xl font-bold">{result.monthGanZhi}</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg bg-primary/5">
                      <div className="text-sm text-muted-foreground mb-2">{t('dayPillar')}</div>
                      <div className="text-2xl font-bold text-primary">{result.dayGanZhi}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {isZh ? '（日主）' : '(Day Master)'}
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">{t('hourPillar')}</div>
                      <div className="text-2xl font-bold">{result.hourGanZhi}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 五行分布 */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('fiveElements')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-5">
                    {[
                      { key: 'metal', label: t('metal'), value: result.wuxing.metal },
                      { key: 'wood', label: t('wood'), value: result.wuxing.wood },
                      { key: 'water', label: t('water'), value: result.wuxing.water },
                      { key: 'fire', label: t('fire'), value: result.wuxing.fire },
                      { key: 'earth', label: t('earth'), value: result.wuxing.earth },
                    ].map((element) => (
                      <div key={element.key} className="text-center">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 ${getWuxingColor(element.label)}`}>
                          <span className="text-2xl font-bold">{element.value}</span>
                        </div>
                        <div className="text-sm font-medium">{element.label}</div>
                        {/* 进度条 */}
                        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${getWuxingColor(element.label).split(' ')[0]}`}
                            style={{ width: `${(element.value / 8) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 八字分析 */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('analysis')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                      {result.analysis}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* 提示信息 */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    {isZh
                      ? '温馨提示：八字算命结果仅供参考，不应作为重要决策的唯一依据。人生的成功更多取决于后天的努力和选择。'
                      : 'Note: Bazi fortune telling results are for reference only and should not be the sole basis for important decisions. Success in life depends more on hard work and choices.'}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

