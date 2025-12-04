import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getZodiacSignById, type ZodiacSignId } from '@/lib/horoscope-data';
import { getCompatibilityScore, getCompatibilityDescription } from '@/lib/compatibility';
import { CompatibilitySelector } from '@/components/horoscope/compatibility-selector';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sign1?: string; sign2?: string }>;
}

export default async function CompatibilityPage({ params, searchParams }: PageProps) {
  const t = await getTranslations('horoscope');
  const { locale } = await params;
  const { sign1: sign1Param, sign2: sign2Param } = await searchParams;

  const sign1 = (sign1Param as ZodiacSignId) || 'aries';
  const sign2 = (sign2Param as ZodiacSignId) || 'taurus';

  const sign1Data = getZodiacSignById(sign1);
  const sign2Data = getZodiacSignById(sign2);

  if (!sign1Data || !sign2Data) {
    return <div>Invalid signs</div>;
  }

  const score = getCompatibilityScore(sign1, sign2);
  const description = getCompatibilityDescription(score, locale);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">{t('compatibilityTitle')}</h1>
          <p className="text-muted-foreground">
            {t('selectTwoSigns')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <CompatibilitySelector 
            sign1={sign1} 
            sign2={sign2} 
            locale={locale}
          />

          {/* 配对结果 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{sign1Data.emoji || '♈'}</div>
                <div className="flex-1">
                  <CardTitle>
                    {sign1Data.nameZh} × {sign2Data.nameZh}
                  </CardTitle>
                  <CardDescription>
                    {sign1Data.nameEn} × {sign2Data.nameEn}
                  </CardDescription>
                </div>
                <div className="text-3xl">{sign2Data.emoji || '♉'}</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{t('compatibilityScore')}</span>
                  <span className="text-2xl font-bold text-primary">{score}%</span>
                </div>
                <Progress value={score} className="h-3" />
              </div>
              <p className="text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

