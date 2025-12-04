"use client";

import { Suspense } from 'react';
import { DateSelector } from './date-selector';

interface DateSelectorWrapperProps {
  currentDate: Date;
  locale: string;
}

export function DateSelectorWrapper({ currentDate, locale }: DateSelectorWrapperProps) {
  return (
    <Suspense fallback={
      <div className="border-2 rounded-lg p-6 text-center text-muted-foreground">
        {locale === 'zh' ? '加载中...' : 'Loading...'}
      </div>
    }>
      <DateSelector currentDate={currentDate} locale={locale} />
    </Suspense>
  );
}

