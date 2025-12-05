import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Wand2, BookOpen } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  return {
    title: locale === 'zh' 
      ? '算命占卜 - 塔罗牌、八字、六爻占卜 | DestinyStar'
      : 'Fortune Telling - Tarot, Bazi, I Ching Divination | DestinyStar',
    description: locale === 'zh'
      ? '专业的在线占卜平台，提供塔罗牌占卜、八字算命、六爻占卜等多种占卜方式。探索你的命运，获得专业的占卜指导和建议。'
      : 'Professional online divination platform offering tarot readings, Bazi fortune telling, I Ching divination and more. Explore your destiny with professional guidance.',
    keywords: locale === 'zh'
      ? '算命,占卜,塔罗牌,八字算命,六爻占卜,在线占卜,塔罗占卜,命运预测,占卜服务'
      : 'fortune telling,divination,tarot cards,Bazi,I Ching,online divination,tarot reading,destiny prediction,divination services',
    openGraph: {
      title: locale === 'zh' ? '算命占卜 - DestinyStar' : 'Fortune Telling - DestinyStar',
      description: locale === 'zh'
        ? '专业的在线占卜平台'
        : 'Professional online divination platform',
      type: 'website',
    },
  };
}

export default async function FortunePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('fortune');
  const tCommon = await getTranslations('common');

  const divinationMethods = [
    {
      icon: Wand2,
      title: t('tarot'),
      description: t('tarotDescription'),
      href: '/fortune/tarot',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      available: true,
    },
    {
      icon: Sparkles,
      title: t('bazi'),
      description: t('baziDescription'),
      href: '/fortune/bazi',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      available: true,
    },
    {
      icon: BookOpen,
      title: t('liuyao'),
      description: t('liuyaoDescription'),
      href: '/fortune/liuyao',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950',
      available: true,
    },
  ];

  return (
    <div className="container mx-auto py-12 md:py-16 px-4">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="gradient-text">{t('title')}</span>
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            {t('description')}
          </p>
        </div>

        {/* Divination Methods */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {divinationMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <Card 
                key={index} 
                className={`card-hover border-2 ${method.available ? '' : 'opacity-75'}`}
              >
                <CardHeader className="space-y-4">
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${method.bgColor}`}>
                    <Icon className={`h-7 w-7 ${method.color}`} />
                  </div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{method.title}</CardTitle>
                    {!method.available && (
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        {locale === 'zh' ? '即将推出' : 'Coming Soon'}
                      </span>
                    )}
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {method.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    asChild 
                    className="w-full" 
                    disabled={!method.available}
                  >
                    <Link href={method.href}>
                      {method.available ? tCommon('startFortune') : (locale === 'zh' ? '敬请期待' : 'Coming Soon')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <Card className="border-2 bg-gradient-to-br from-primary/5 to-purple-500/5 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">
              {locale === 'zh' ? '关于占卜' : 'About Divination'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              {locale === 'zh'
                ? '占卜是一种古老的智慧传统，通过不同的方法和工具来探索未来和了解自我。我们的平台提供多种专业的占卜服务，帮助您获得洞察和指导。'
                : 'Divination is an ancient wisdom tradition that uses various methods and tools to explore the future and understand oneself. Our platform offers multiple professional divination services to help you gain insights and guidance.'}
            </p>
            <p>
              {locale === 'zh'
                ? '请注意，占卜结果仅供参考，不应作为重要决策的唯一依据。保持开放的心态，将占卜视为自我反思和探索的工具。'
                : 'Please note that divination results are for reference only and should not be the sole basis for important decisions. Keep an open mind and view divination as a tool for self-reflection and exploration.'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
