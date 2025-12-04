import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import "../globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale: locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  
  const isZh = locale === 'zh';
  
  return {
    title: isZh 
      ? 'DestinyStar - 专业的星座运势、算命占卜、黄历查询平台'
      : 'DestinyStar - Professional Horoscope, Fortune Telling & Calendar Platform',
    description: isZh
      ? 'DestinyStar提供每日星座运势、塔罗占卜、八字算命、黄历查询等专业服务。探索你的命运，了解星座配对和性格特点，查询每日吉时和宜忌事项。'
      : 'DestinyStar offers professional horoscope readings, tarot divination, Bazi fortune telling, and calendar services. Explore your destiny, learn about zodiac compatibility and personality traits.',
    keywords: isZh
      ? '星座运势,算命,占卜,塔罗牌,八字,黄历,吉时,星座配对,每日运势,周运势,月运势,在线占卜,命运预测'
      : 'horoscope,fortune telling,divination,tarot,Bazi,calendar,astrology,zodiac compatibility,daily horoscope,online divination,destiny prediction',
    authors: [{ name: 'DestinyStar' }],
    creator: 'DestinyStar',
    publisher: 'DestinyStar',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://destinystar.com'),
    alternates: {
      canonical: '/',
      languages: {
        'zh': '/zh',
        'en': '/en',
      },
    },
    openGraph: {
      type: 'website',
      locale: isZh ? 'zh_CN' : 'en_US',
      url: '/',
      title: isZh ? 'DestinyStar - 专业的星座运势平台' : 'DestinyStar - Professional Horoscope Platform',
      description: isZh
        ? '探索你的命运，了解星座运势、占卜和黄历'
        : 'Explore your destiny with horoscope, divination and calendar',
      siteName: 'DestinyStar',
    },
    twitter: {
      card: 'summary_large_image',
      title: isZh ? 'DestinyStar - 专业的星座运势平台' : 'DestinyStar - Professional Horoscope Platform',
      description: isZh
        ? '探索你的命运，了解星座运势、占卜和黄历'
        : 'Explore your destiny with horoscope, divination and calendar',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  let locale: string;
  let messages: any;
  
  try {
    const resolvedParams = await params;
    locale = resolvedParams.locale;
    
    // Ensure that the incoming `locale` is valid
    if (!locales.includes(locale as typeof locales[number])) {
      notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    messages = await getMessages({ locale });
  } catch (error) {
    console.error('Error in LocaleLayout:', error);
    // Fallback to default locale
    locale = 'zh';
    try {
      messages = await getMessages({ locale: 'zh' });
    } catch (fallbackError) {
      console.error('Error loading fallback messages:', fallbackError);
      messages = {};
    }
  }

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

