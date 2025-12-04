"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from '@/lib/navigation';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface DateSelectorProps {
  currentDate: Date;
  locale: string;
}

export function DateSelector({ currentDate, locale }: DateSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('calendar');
  const isZh = locale === 'zh';
  
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get date param from URL
  const dateParam = searchParams.get('date');
  
  // Initialize state from URL param or currentDate prop
  const [selectedDate, setSelectedDate] = useState(() => {
    if (dateParam) {
      const dateFromUrl = new Date(dateParam);
      if (!isNaN(dateFromUrl.getTime())) {
        return dateFromUrl;
      }
    }
    return new Date(currentDate);
  });

  // Update state when URL param changes
  useEffect(() => {
    const urlDateParam = searchParams.get('date');
    if (urlDateParam) {
      const dateFromUrl = new Date(urlDateParam);
      if (!isNaN(dateFromUrl.getTime())) {
        setSelectedDate((prevDate) => {
          const dateStr = formatDateForInput(dateFromUrl);
          const currentStr = formatDateForInput(prevDate);
          if (dateStr !== currentStr) {
            return dateFromUrl;
          }
          return prevDate;
        });
      }
    }
  }, [searchParams]);

  const handleDateChange = (dateString: string) => {
    const newDate = new Date(dateString);
    if (!isNaN(newDate.getTime())) {
      const params = new URLSearchParams();
      params.set('date', formatDateForInput(newDate));
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const navigateDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    handleDateChange(formatDateForInput(newDate));
  };

  const goToToday = () => {
    const today = new Date();
    handleDateChange(formatDateForInput(today));
  };

  const goToDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    handleDateChange(formatDateForInput(date));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          {t('selectDate')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 日期输入 */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={formatDateForInput(selectedDate)}
            onChange={(e) => handleDateChange(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* 快速选择按钮 */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToDate(-1)}
            className="flex-1 min-w-[80px]"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {isZh ? '昨天' : 'Yesterday'}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={goToToday}
            className="flex-1 min-w-[80px]"
          >
            {isZh ? '今天' : 'Today'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToDate(1)}
            className="flex-1 min-w-[80px]"
          >
            {isZh ? '明天' : 'Tomorrow'}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* 日期导航 */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateDate(-1)}
            className="flex-1"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {isZh ? '前一天' : 'Previous Day'}
          </Button>
          <div className="text-sm text-muted-foreground px-4">
            {selectedDate.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateDate(1)}
            className="flex-1"
          >
            {isZh ? '后一天' : 'Next Day'}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
