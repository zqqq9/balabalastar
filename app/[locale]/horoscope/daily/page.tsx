import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { zodiacSigns, getZodiacSignById, type ZodiacSignId } from '@/lib/horoscope-data';
import { generateDailyHoroscope } from '@/lib/horoscope-content-enhanced';
import { HoroscopeDisplay } from '@/components/horoscope/horoscope-display';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sign?: string; date?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const { sign } = await searchParams;
  const signId = (sign as ZodiacSignId) || 'aries';
  const selectedSign = getZodiacSignById(signId);
  const signName = locale === 'zh' ? selectedSign?.nameZh : selectedSign?.nameEn;
  
  return {
    title: locale === 'zh' 
      ? `${signName}每日运势 - ${new Date().toLocaleDateString('zh-CN')} | DestinyStar`
      : `${signName} Daily Horoscope - ${new Date().toLocaleDateString('en-US')} | DestinyStar`,
    description: locale === 'zh'
      ? `查询${signName}的每日运势，包括爱情、事业、财运、健康等各方面的详细分析和幸运数字、幸运颜色。`
      : `Check ${signName} daily horoscope including detailed analysis of love, career, wealth, health, lucky numbers and colors.`,
    keywords: locale === 'zh'
      ? `${signName},每日运势,星座运势,${signName}运势,今日运势,爱情运势,事业运势,财运,健康运势`
      : `${signName},daily horoscope,zodiac horoscope,${signName} horoscope,today horoscope,love horoscope,career horoscope,wealth,health horoscope`,
  };
}

export default async function DailyHoroscopePage({ params, searchParams }: PageProps) {
  const t = await getTranslations('horoscope');
  const { locale } = await params;
  const { sign, date } = await searchParams;

  const selectedSignId = (sign as ZodiacSignId) || 'aries';
  const selectedDate = date ? new Date(date) : new Date();
  const selectedSign = getZodiacSignById(selectedSignId);

  if (!selectedSign) {
    return <div>Invalid sign</div>;
  }

  const horoscope = generateDailyHoroscope(selectedSignId, selectedDate, locale);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">{t('daily')}</h1>
          <p className="text-muted-foreground">
            {t('selectSign')} - {selectedDate.toLocaleDateString(locale)}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{selectedSign.nameZh} / {selectedSign.nameEn}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedSign.dateRange}
              </p>
            </CardHeader>
            <CardContent>
              <HoroscopeDisplay horoscope={horoscope} locale={locale} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('selectSign')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {zodiacSigns.map((sign) => (
                  <Link
                    key={sign.id}
                    href={`/horoscope/daily?sign=${sign.id}`}
                    className="group"
                  >
                    <Card className={`hover:border-primary transition-colors cursor-pointer ${
                      selectedSignId === sign.id ? 'border-primary' : ''
                    }`}>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">{sign.emoji || '♈'}</div>
                        <div className="font-medium group-hover:text-primary">
                          {sign.nameZh}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {sign.nameEn}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

