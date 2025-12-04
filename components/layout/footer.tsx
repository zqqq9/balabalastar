"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';

export function Footer() {
  const t = useTranslations('common');
  const tFooter = useTranslations('footer');

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto py-10 md:py-12 px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 max-w-6xl mx-auto">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">🌟 {t('appName')}</h3>
            <p className="text-sm text-muted-foreground">
              {tFooter('description')}
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">{tFooter('features')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/horoscope" className="hover:text-primary">
                  {t('horoscope')}
                </Link>
              </li>
              <li>
                <Link href="/fortune" className="hover:text-primary">
                  {t('fortune')}
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="hover:text-primary">
                  {t('calendar')}
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">{tFooter('about')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary">
                  {t('terms')}
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">{t('contact')}</h4>
            <p className="text-sm text-muted-foreground">
              {tFooter('contactDescription')}
            </p>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {t('appName')}. {t('allRightsReserved')}.</p>
        </div>
      </div>
    </footer>
  );
}
