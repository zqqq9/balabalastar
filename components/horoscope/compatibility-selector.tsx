"use client";

import { useRouter } from '@/lib/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodiacSigns, type ZodiacSignId } from '@/lib/horoscope-data';
import { useTranslations } from 'next-intl';

interface CompatibilitySelectorProps {
  sign1: ZodiacSignId;
  sign2: ZodiacSignId;
  locale: string;
}

export function CompatibilitySelector({ sign1, sign2, locale }: CompatibilitySelectorProps) {
  const router = useRouter();
  const t = useTranslations('horoscope');

  const handleSignChange = (which: 'sign1' | 'sign2', value: ZodiacSignId) => {
    const params = new URLSearchParams();
    if (which === 'sign1') {
      params.set('sign1', value);
      params.set('sign2', sign2);
    } else {
      params.set('sign1', sign1);
      params.set('sign2', value);
    }
    router.push(`/horoscope/compatibility?${params.toString()}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('selectSign')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">{locale === 'zh' ? '星座 1' : 'Sign 1'}</label>
            <Select value={sign1} onValueChange={(value) => handleSignChange('sign1', value as ZodiacSignId)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {zodiacSigns.map((sign) => (
                  <SelectItem key={sign.id} value={sign.id}>
                    <span className="flex items-center gap-2">
                      <span>{sign.emoji || '♈'}</span>
                      <span>{sign.nameZh} / {sign.nameEn}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{locale === 'zh' ? '星座 2' : 'Sign 2'}</label>
            <Select value={sign2} onValueChange={(value) => handleSignChange('sign2', value as ZodiacSignId)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {zodiacSigns.map((sign) => (
                  <SelectItem key={sign.id} value={sign.id}>
                    <span className="flex items-center gap-2">
                      <span>{sign.emoji || '♈'}</span>
                      <span>{sign.nameZh} / {sign.nameEn}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

