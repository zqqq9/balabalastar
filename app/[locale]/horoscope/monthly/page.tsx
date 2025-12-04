import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { zodiacSigns, getZodiacSignById, type ZodiacSignId } from '@/lib/horoscope-data';
import { generateMonthlyHoroscope } from '@/lib/horoscope-content-enhanced';
import { HoroscopeDisplay } from '@/components/horoscope/horoscope-display';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sign?: string }>;
}

export default async function MonthlyHoroscopePage({ params, searchParams }: PageProps) {
  const t = await getTranslations('horoscope');
  const { locale } = await params;
  const { sign } = await searchParams;

  const selectedSignId = (sign as ZodiacSignId) || 'aries';
  const selectedSign = getZodiacSignById(selectedSignId);

  if (!selectedSign) {
    return <div>Invalid sign</div>;
  }

  // 获取本月的开始日期
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const horoscope = generateMonthlyHoroscope(selectedSignId, monthStart, locale);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">{t('monthly')}</h1>
          <p className="text-muted-foreground">
            {t('selectSign')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{selectedSign.nameZh} / {selectedSign.nameEn}</CardTitle>
              <CardDescription>
                {selectedSign.dateRange}
              </CardDescription>
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
                    href={`/horoscope/monthly?sign=${sign.id}`}
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

