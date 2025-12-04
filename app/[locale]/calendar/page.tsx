import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { CalendarDisplay } from '@/components/calendar/calendar-display';
import { DateSelector } from '@/components/calendar/date-selector';
import { CalendarErrorBoundary } from '@/components/calendar/calendar-error-boundary';
import { getCalendarDay } from '@/lib/calendar-data-enhanced';
import { Calendar as CalendarIcon } from 'lucide-react';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ date?: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  return {
    title: locale === 'zh' 
      ? '黄历查询 - 每日吉时、宜忌事项查询 | DestinyStar'
      : 'Chinese Calendar - Daily Auspicious Times & Activities | DestinyStar',
    description: locale === 'zh'
      ? '查询中国传统黄历，了解每日农历日期、干支、生肖、宜忌事项、吉时凶时等详细信息。帮助您选择最佳时机进行重要活动。'
      : 'Check the traditional Chinese calendar to learn about lunar dates, GanZhi, zodiac signs, suitable and avoid activities, auspicious and inauspicious times. Help you choose the best time for important activities.',
    keywords: locale === 'zh'
      ? '黄历,农历,老黄历,吉时,凶时,宜忌,干支,生肖,黄道吉日,择日'
      : 'Chinese calendar,lunar calendar,auspicious time,inauspicious time,suitable activities,avoid activities,GanZhi,zodiac signs,auspicious day,date selection',
    openGraph: {
      title: locale === 'zh' ? '黄历查询 - DestinyStar' : 'Chinese Calendar - DestinyStar',
      description: locale === 'zh'
        ? '专业的黄历查询平台'
        : 'Professional Chinese calendar platform',
      type: 'website',
    },
  };
}

export default async function CalendarPage({ params, searchParams }: PageProps) {
  let locale: string;
  let t: any;
  let selectedDate: Date;
  let calendarDay: any;
  
  try {
    const resolvedParams = await params;
    locale = resolvedParams.locale;
    t = await getTranslations('calendar');
    
    const resolvedSearchParams = await searchParams;
    const { date } = resolvedSearchParams;

    // Safely parse date
    try {
      if (date) {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
          selectedDate = parsedDate;
        } else {
          selectedDate = new Date();
        }
      } else {
        selectedDate = new Date();
      }
    } catch (error) {
      console.error('Error parsing date:', error);
      selectedDate = new Date();
    }

    // Generate calendar data
    try {
      calendarDay = getCalendarDay(selectedDate, locale);
    } catch (error) {
      console.error('Error generating calendar day:', error);
      // Fallback to basic calendar day
      calendarDay = {
        date: selectedDate,
        lunarDate: locale === 'zh' ? '农历日期' : 'Lunar Date',
        ganZhi: {
          year: '--',
          month: '--',
          day: '--',
          hour: '--',
        },
        zodiac: '--',
        suitable: [],
        avoid: [],
        luckyHours: [],
        unluckyHours: [],
        wuxing: '--',
        festivals: [],
      };
    }
  } catch (error) {
    console.error('Error in CalendarPage:', error);
    // Fallback values
    locale = 'zh';
    try {
      t = await getTranslations('calendar');
    } catch {
      t = { title: () => '黄历查询' };
    }
    selectedDate = new Date();
    try {
      calendarDay = getCalendarDay(selectedDate, locale);
    } catch {
      calendarDay = {
        date: selectedDate,
        lunarDate: '农历日期',
        ganZhi: { year: '--', month: '--', day: '--', hour: '--' },
        zodiac: '--',
        suitable: [],
        avoid: [],
        luckyHours: [],
        unluckyHours: [],
        wuxing: '--',
        festivals: [],
      };
    }
  }

  return (
    <div className="container mx-auto py-12 md:py-16 px-4">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <CalendarIcon className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="gradient-text">{t('title')}</span>
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            {selectedDate.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </p>
        </div>

        {/* Date Selector */}
        <div className="max-w-2xl mx-auto">
          <CalendarErrorBoundary>
            <Suspense fallback={
              <div className="border-2 rounded-lg p-6 text-center text-muted-foreground">
                {locale === 'zh' ? '加载中...' : 'Loading...'}
              </div>
            }>
              <DateSelector currentDate={selectedDate} locale={locale} />
            </Suspense>
          </CalendarErrorBoundary>
        </div>

        {/* Calendar Display */}
        <div className="max-w-5xl mx-auto">
          <CalendarErrorBoundary>
            <CalendarDisplay calendarDay={calendarDay} locale={locale} />
          </CalendarErrorBoundary>
        </div>

        {/* Info Section */}
        <div className="max-w-3xl mx-auto mt-12">
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">
              {locale === 'zh' ? '关于黄历' : 'About Chinese Calendar'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {locale === 'zh'
                ? '黄历是中国传统的历法，包含了丰富的天文、地理、人文信息。通过查询黄历，您可以了解每日的吉凶时辰、适宜和忌讳的活动，帮助您选择最佳时机进行重要事务。'
                : 'The Chinese calendar is a traditional Chinese calendar system containing rich astronomical, geographical, and cultural information. By consulting the calendar, you can learn about daily auspicious and inauspicious times, suitable and avoid activities, helping you choose the best time for important matters.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
