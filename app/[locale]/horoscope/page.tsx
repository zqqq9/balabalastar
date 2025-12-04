import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { zodiacSigns } from '@/lib/horoscope-data';
import { Calendar, CalendarDays, CalendarRange, Heart, User } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  return {
    title: locale === 'zh' 
      ? '星座运势 - 每日、每周、每月运势查询 | DestinyStar'
      : 'Horoscope - Daily, Weekly, Monthly Readings | DestinyStar',
    description: locale === 'zh'
      ? '查询12星座的每日、每周、每月运势，了解爱情、事业、财运、健康等各方面运势。探索星座配对和性格特点，掌握你的命运走向。'
      : 'Check daily, weekly, and monthly horoscopes for all 12 zodiac signs. Discover love, career, wealth, and health forecasts. Explore zodiac compatibility and personality traits.',
    keywords: locale === 'zh'
      ? '星座运势,每日运势,周运势,月运势,星座配对,星座性格,12星座,白羊座,金牛座,双子座,巨蟹座,狮子座,处女座,天秤座,天蝎座,射手座,摩羯座,水瓶座,双鱼座'
      : 'horoscope,daily horoscope,weekly horoscope,monthly horoscope,zodiac compatibility,zodiac signs,astrology,aries,taurus,gemini,cancer,leo,virgo,libra,scorpio,sagittarius,capricorn,aquarius,pisces',
    openGraph: {
      title: locale === 'zh' ? '星座运势查询 - DestinyStar' : 'Horoscope Readings - DestinyStar',
      description: locale === 'zh'
        ? '专业的星座运势查询平台'
        : 'Professional horoscope reading platform',
      type: 'website',
    },
  };
}

export default async function HoroscopePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('horoscope');
  const tCommon = await getTranslations('common');

  const features = [
    {
      icon: Calendar,
      title: t('daily'),
      description: t('selectSign'),
      href: '/horoscope/daily',
      color: 'text-blue-500',
    },
    {
      icon: CalendarDays,
      title: t('weekly'),
      description: t('selectSign'),
      href: '/horoscope/weekly',
      color: 'text-purple-500',
    },
    {
      icon: CalendarRange,
      title: t('monthly'),
      description: t('selectSign'),
      href: '/horoscope/monthly',
      color: 'text-pink-500',
    },
    {
      icon: Heart,
      title: t('compatibility'),
      description: t('selectTwoSigns'),
      href: '/horoscope/compatibility',
      color: 'text-red-500',
    },
    {
      icon: User,
      title: t('personality'),
      description: t('selectSignToView'),
      href: '/horoscope/personality',
      color: 'text-green-500',
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
            {locale === 'zh'
              ? '探索12星座的运势走向，了解爱情、事业、财运、健康等各方面的详细分析'
              : 'Explore horoscope trends for all 12 zodiac signs, discover detailed analysis of love, career, wealth, and health'}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="card-hover border-2">
                <CardHeader className="space-y-4">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={feature.href}>{tCommon('viewNow')}</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Zodiac Signs Grid */}
        <div className="space-y-6 max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">{t('selectSign')}</h2>
            <p className="text-muted-foreground">
              {locale === 'zh' ? '点击星座卡片查看详细运势' : 'Click on a zodiac sign card to view detailed horoscope'}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {zodiacSigns.map((sign) => (
              <Link
                key={sign.id}
                href={`/horoscope/daily?sign=${sign.id}`}
                className="group"
              >
                <Card className="card-hover border-2 group-hover:border-primary transition-all">
                  <CardContent className="p-6 text-center space-y-2">
                    <div className="text-4xl mb-2">{sign.emoji || '♈'}</div>
                    <div className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {sign.nameZh}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {sign.nameEn}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {sign.dateRange}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
