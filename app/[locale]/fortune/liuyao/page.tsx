"use client";

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateLiuYao, type LiuYaoResult } from '@/lib/liuyao-calculator';
import { LiuYaoDisplay } from '@/components/fortune/liuyao-display';
import { BookOpen, RotateCcw, Sparkles, Loader2 } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function LiuYaoPage() {
  const t = useTranslations('fortune');
  const locale = useLocale();
  const isZh = locale === 'zh';
  
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<LiuYaoResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [interpretation, setInterpretation] = useState<{
    summary: string;
    detailed: string;
    advice: string;
  } | null>(null);
  const [isLoadingInterpretation, setIsLoadingInterpretation] = useState(false);
  const [interpretationError, setInterpretationError] = useState<string | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setResult(null);
    
    // 添加生成动画延迟
    setTimeout(() => {
      const liuYaoResult = generateLiuYao(locale);
      setResult(liuYaoResult);
      setIsGenerating(false);
    }, 800);
  };

  const handleReset = () => {
    setQuestion('');
    setResult(null);
    setInterpretation(null);
    setInterpretationError(null);
  };

  const handleGetInterpretation = async () => {
    if (!result) {
      console.warn('没有卦象结果，无法获取解答');
      return;
    }
    
    console.log('开始获取大师解答，本卦:', result.benGua.nameZh, '变卦:', result.bianGua?.nameZh || '无');
    setIsLoadingInterpretation(true);
    setInterpretationError(null);
    
    try {
      const requestBody = {
        yaos: result.yaos,
        benGua: result.benGua,
        bianGua: result.bianGua,
        changingYaos: result.changingYaos,
        question: question || undefined,
        locale, // 传递语言设置
      };
      
      console.log('发送请求到 /api/fortune/liuyao/interpretation', requestBody);
      
      const response = await fetch('/api/fortune/liuyao/interpretation', {
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

  return (
    <div className="container mx-auto py-6 md:py-8 px-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <span className="gradient-text">{t('liuyao')}</span>
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            {t('liuyaoDescription')}
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-4">
          {/* 问题输入 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('enterQuestion')}</CardTitle>
              <CardDescription className="text-xs">
                {isZh 
                  ? '静心思考您的问题，然后开始占卜' 
                  : 'Think about your question, then start divination'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label htmlFor="question" className="text-xs font-medium">
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
                
                <div className="flex gap-3">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    size="default"
                    className="min-w-[180px]"
                  >
                    {isGenerating ? (
                      <>
                        <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                        {isZh ? '正在占卜...' : 'Divining...'}
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        {isZh ? '开始占卜' : 'Start Divination'}
                      </>
                    )}
                  </Button>
                  {result && (
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      size="default"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      {isZh ? '重新占卜' : 'Divine Again'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 占卜说明 */}
          <Card className="bg-muted/50">
            <CardContent className="py-3">
              <div className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
                <p>
                  {isZh 
                    ? '六爻占卜是中国传统的占卜方法，通过投掷硬币生成六个爻，形成64卦中的一卦。每个爻有四种状态：老阳（9）、少阴（8）、少阳（7）、老阴（6）。老阳和老阴为变爻，会形成变卦。'
                    : 'I Ching divination is a traditional Chinese divination method that generates six lines by tossing coins, forming one of the 64 hexagrams. Each line has four states: Old Yang (9), Young Yin (8), Young Yang (7), and Old Yin (6). Old Yang and Old Yin are changing lines that form a changed hexagram.'}
                </p>
                <p>
                  {isZh 
                    ? '本系统使用随机数模拟投掷硬币的过程，为您生成六爻卦象。'
                    : 'This system uses random numbers to simulate the coin-tossing process and generate hexagrams for you.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 显示占卜结果 */}
          {result && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* 结果标题 */}
              <div className="flex flex-col gap-1 pb-2 border-b">
                <h2 className="text-lg font-semibold">
                  {isZh ? '占卜结果' : 'Divination Result'}
                </h2>
                {question && (
                  <p className="text-xs text-muted-foreground">
                    {isZh ? '您的问题：' : 'Your question: '}
                    <span className="text-foreground font-medium">{question}</span>
                  </p>
                )}
              </div>

              {/* 卦象显示 */}
              <LiuYaoDisplay
                yaos={result.yaos}
                benGua={result.benGua}
                bianGua={result.bianGua}
                changingYaos={result.changingYaos}
                locale={locale}
              />

              {/* 基础解读 */}
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="h-4 w-4 text-primary" />
                    {isZh ? '基础解读' : 'Basic Interpretation'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-foreground">
                      {result.interpretation}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* 大师解答按钮 */}
              <div className="flex justify-center pt-2">
                <Button
                  onClick={handleGetInterpretation}
                  disabled={isLoadingInterpretation}
                  size="default"
                  className="min-w-[200px]"
                >
                  {isLoadingInterpretation ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isZh ? '正在获取解答...' : 'Getting interpretation...'}
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4 mr-2" />
                      {isZh ? '大师解答' : 'Master Interpretation'}
                    </>
                  )}
                </Button>
              </div>

              {/* 大师解答结果 */}
              {interpretation && (
                <Card className="mt-3 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BookOpen className="h-4 w-4 text-primary" />
                      {isZh ? '大师解答' : 'Master Interpretation'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div>
                      <h4 className="text-xs font-semibold mb-1.5 text-primary">
                        {isZh ? '摘要' : 'Summary'}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {interpretation.summary}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-semibold mb-1.5 text-primary">
                        {isZh ? '详细解读' : 'Detailed Interpretation'}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                        {interpretation.detailed}
                      </p>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <h4 className="text-xs font-semibold mb-1.5 text-primary">
                        {isZh ? '建议' : 'Advice'}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {interpretation.advice}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 错误提示 */}
              {interpretationError && (
                <Card className="mt-3 border-destructive/20 bg-destructive/5">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-xs text-destructive text-center">
                      {interpretationError}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* 提示信息 */}
              <Card className="bg-muted/50 border-muted">
                <CardContent className="py-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {isZh
                      ? '温馨提示：六爻占卜结果仅供参考，不应作为重要决策的唯一依据。占卜的目的是帮助您更好地理解当前情况，做出明智的选择。'
                      : 'Note: I Ching divination results are for reference only and should not be the sole basis for important decisions. The purpose of divination is to help you better understand the current situation and make wise choices.'}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 占卜动画提示 */}
          {isGenerating && (
            <div className="text-center py-8">
              <div className="inline-flex flex-col items-center gap-3">
                <div className="relative">
                  <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                  <RotateCcw className="h-5 w-5 text-primary absolute -top-1 -right-1 animate-spin" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {isZh ? '正在为您占卜...' : 'Divining for you...'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isZh ? '模拟投掷硬币，生成六爻卦象' : 'Simulating coin tosses, generating hexagram'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
