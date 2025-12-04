import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Calendar, Wand2, Star, TrendingUp, Users, BookOpen, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('home');
  
  return {
    title: locale === 'zh' 
      ? 'DestinyStar - 专业的星座运势、算命占卜、黄历查询平台'
      : 'DestinyStar - Professional Horoscope, Fortune Telling & Calendar Platform',
    description: locale === 'zh'
      ? 'DestinyStar提供每日星座运势、塔罗占卜、八字算命、黄历查询等专业服务。探索你的命运，了解星座配对和性格特点，查询每日吉时和宜忌事项。'
      : 'DestinyStar offers professional horoscope readings, tarot divination, Bazi fortune telling, and calendar services. Explore your destiny, learn about zodiac compatibility and personality traits.',
    keywords: locale === 'zh'
      ? '星座运势,算命,占卜,塔罗牌,八字,黄历,吉时,星座配对,每日运势,周运势,月运势'
      : 'horoscope,fortune telling,divination,tarot,Bazi,calendar,astrology,zodiac compatibility,daily horoscope',
    openGraph: {
      title: locale === 'zh' ? 'DestinyStar - 专业的星座运势平台' : 'DestinyStar - Professional Horoscope Platform',
      description: locale === 'zh'
        ? '探索你的命运，了解星座运势、占卜和黄历'
        : 'Explore your destiny with horoscope, divination and calendar',
      type: 'website',
    },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('home');
  const tCommon = await getTranslations('common');

  const features = [
    {
      icon: Star,
      title: t('horoscopeCard.title'),
      description: t('horoscopeCard.description'),
      href: '/horoscope',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
    },
    {
      icon: Wand2,
      title: t('fortuneCard.title'),
      description: t('fortuneCard.description'),
      href: '/fortune',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      icon: Calendar,
      title: t('calendarCard.title'),
      description: t('calendarCard.description'),
      href: '/calendar',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
  ];

  const stats = [
    { label: locale === 'zh' ? '每日用户' : 'Daily Users', value: '10K+' },
    { label: locale === 'zh' ? '占卜次数' : 'Divinations', value: '50K+' },
    { label: locale === 'zh' ? '星座数据' : 'Zodiac Signs', value: '12' },
    { label: locale === 'zh' ? '塔罗牌' : 'Tarot Cards', value: '78' },
  ];

  const howToUseSteps = [
    {
      step: 1,
      title: locale === 'zh' ? '选择功能' : 'Choose Feature',
      description: locale === 'zh' 
        ? '从星座运势、算命占卜或黄历查询中选择你想要使用的功能'
        : 'Select the feature you want to use from horoscope, fortune telling, or calendar',
      icon: BookOpen,
    },
    {
      step: 2,
      title: locale === 'zh' ? '输入信息' : 'Enter Information',
      description: locale === 'zh'
        ? '根据所选功能，输入你的星座、出生日期或其他相关信息'
        : 'Enter your zodiac sign, birth date, or other relevant information based on the selected feature',
      icon: HelpCircle,
    },
    {
      step: 3,
      title: locale === 'zh' ? '查看结果' : 'View Results',
      description: locale === 'zh'
        ? '系统将为你生成详细的运势分析、占卜结果或黄历信息'
        : 'The system will generate detailed horoscope analysis, divination results, or calendar information for you',
      icon: CheckCircle2,
    },
  ];

  const faqs = [
    {
      question: locale === 'zh' ? '如何查询我的星座运势？' : 'How do I check my horoscope?',
      answer: locale === 'zh'
        ? '进入星座运势页面，选择你的星座，然后选择查看每日、每周或每月运势即可。'
        : 'Go to the horoscope page, select your zodiac sign, then choose to view daily, weekly, or monthly horoscope.',
    },
    {
      question: locale === 'zh' ? '塔罗占卜准确吗？' : 'Is tarot divination accurate?',
      answer: locale === 'zh'
        ? '塔罗占卜是一种探索内心和未来的工具，结果仅供参考。重要的是保持开放的心态，将其作为自我反思的辅助。'
        : 'Tarot divination is a tool for exploring the inner self and future, results are for reference only. It\'s important to keep an open mind and use it as an aid for self-reflection.',
    },
    {
      question: locale === 'zh' ? '黄历查询有什么用？' : 'What is the Chinese calendar used for?',
      answer: locale === 'zh'
        ? '黄历可以帮助你了解每日的吉时、宜忌事项，选择最佳时机进行重要活动，如结婚、搬家、开业等。'
        : 'The Chinese calendar can help you understand daily auspicious times and suitable/avoid activities, choosing the best time for important activities like weddings, moving, opening businesses, etc.',
    },
    {
      question: locale === 'zh' ? '需要注册账号吗？' : 'Do I need to register an account?',
      answer: locale === 'zh'
        ? '目前所有功能都可以免费使用，无需注册账号。未来可能会推出会员功能，注册用户将享受更多特权。'
        : 'Currently all features are free to use without registration. We may introduce membership features in the future, and registered users will enjoy more privileges.',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto relative py-24 md:py-32 lg:py-40 px-4">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <div className="inline-flex items-center rounded-full border bg-background/50 px-4 py-2 text-sm backdrop-blur-sm">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              <span className="text-muted-foreground">
                {locale === 'zh' ? '探索命运的神秘世界' : 'Explore the Mysterious World of Destiny'}
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="gradient-text">{t('title')}</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl lg:text-2xl">
              {t('subtitle')}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="h-12 px-8 text-lg">
                <Link href="/horoscope">{tCommon('viewNow')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 text-lg">
                <Link href="/fortune">{tCommon('startFortune')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-muted/30 py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">{stat.value}</div>
                <div className="mt-2 text-sm text-muted-foreground md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {locale === 'zh' ? '核心功能' : 'Core Features'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {locale === 'zh' 
                ? '一站式命运探索平台，提供全方位的占卜和运势服务'
                : 'One-stop destiny exploration platform with comprehensive divination and fortune services'}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="card-hover border-2">
                <CardHeader className="space-y-4">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor}`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full" variant="outline">
                    <Link href={feature.href}>
                      {locale === 'zh' ? '立即体验' : 'Try Now'} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="border-t bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {locale === 'zh' ? '如何使用' : 'How to Use'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {locale === 'zh'
                ? '简单三步，轻松探索你的命运'
                : 'Three simple steps to explore your destiny'}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {howToUseSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index} className="border-2 relative">
                  <CardHeader className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl">
                        {step.step}
                      </div>
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="border-t py-16 md:py-24">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {locale === 'zh' ? '为什么选择 DestinyStar' : 'Why Choose DestinyStar'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {locale === 'zh'
                ? '专业、准确、易用的命运探索工具'
                : 'Professional, accurate, and easy-to-use destiny exploration tools'}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mb-4" />
                <CardTitle>{locale === 'zh' ? '每日更新' : 'Daily Updates'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {locale === 'zh'
                    ? '每日更新的星座运势和占卜内容，确保信息的时效性和准确性'
                    : 'Daily updated horoscope and divination content, ensuring timeliness and accuracy'}
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-4" />
                <CardTitle>{locale === 'zh' ? '专业算法' : 'Professional Algorithms'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {locale === 'zh'
                    ? '基于传统占卜学和现代算法的专业计算，提供准确的运势分析'
                    : 'Professional calculations based on traditional divination and modern algorithms'}
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardHeader>
                <Sparkles className="h-8 w-8 text-primary mb-4" />
                <CardTitle>{locale === 'zh' ? '多语言支持' : 'Multi-language Support'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {locale === 'zh'
                    ? '支持中文和英文，为全球用户提供便捷的服务'
                    : 'Support for Chinese and English, providing convenient services for global users'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {locale === 'zh' ? '常见问题' : 'Frequently Asked Questions'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {locale === 'zh'
                ? '解答你关于 DestinyStar 的疑问'
                : 'Answers to your questions about DestinyStar'}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <Card className="gradient-bg border-0 text-primary-foreground shadow-2xl">
              <CardHeader className="text-center space-y-4 px-6 pt-8 pb-6">
                <CardTitle className="text-3xl md:text-4xl font-bold">
                  {locale === 'zh' ? '开始你的命运探索之旅' : 'Start Your Destiny Exploration Journey'}
                </CardTitle>
                <CardDescription className="text-primary-foreground/90 text-lg">
                  {locale === 'zh'
                    ? '立即体验专业的星座运势和占卜服务'
                    : 'Experience professional horoscope and divination services now'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row justify-center items-center gap-4 px-6 pb-8">
                <Button 
                  asChild 
                  size="lg" 
                  className="h-14 px-10 text-lg font-semibold bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/horoscope" className="flex items-center gap-2">
                    {tCommon('viewNow')}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size="lg" 
                  className="h-14 px-10 text-lg font-semibold bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:scale-105"
                >
                  <Link href="/fortune" className="flex items-center gap-2">
                    {tCommon('startFortune')}
                    <Sparkles className="h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
