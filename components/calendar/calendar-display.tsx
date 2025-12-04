"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CalendarDay } from '@/lib/calendar-data-enhanced';

interface CalendarDisplayProps {
  calendarDay: CalendarDay;
  locale: string;
}

export function CalendarDisplay({ calendarDay, locale }: CalendarDisplayProps) {
  const isZh = locale === 'zh';

  return (
    <div className="space-y-6">
      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>{isZh ? '基本信息' : 'Basic Information'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {isZh ? '农历日期' : 'Lunar Date'}
              </p>
              <p className="text-lg font-semibold">{calendarDay.lunarDate}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {isZh ? '年柱' : 'Year Pillar'}
              </p>
              <p className="text-lg font-semibold">{calendarDay.ganZhi.year}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {isZh ? '月柱' : 'Month Pillar'}
              </p>
              <p className="text-lg font-semibold">{calendarDay.ganZhi.month}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {isZh ? '日柱' : 'Day Pillar'}
              </p>
              <p className="text-lg font-semibold">{calendarDay.ganZhi.day}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {isZh ? '时柱' : 'Hour Pillar'}
              </p>
              <p className="text-lg font-semibold">{calendarDay.ganZhi.hour}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {isZh ? '生肖' : 'Zodiac'}
              </p>
              <p className="text-lg font-semibold">{calendarDay.zodiac}</p>
            </div>
            {calendarDay.wuxing && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {isZh ? '五行' : 'Five Elements'}
                </p>
                <p className="text-lg font-semibold">{calendarDay.wuxing}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 宜忌事项 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">
              {isZh ? '宜' : 'Suitable'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(
                calendarDay.suitable.reduce((acc, item) => {
                  if (!acc[item.category]) acc[item.category] = [];
                  acc[item.category].push(item.name);
                  return acc;
                }, {} as Record<string, string[]>)
              ).map(([category, items]) => (
                <div key={category}>
                  <p className="text-xs text-muted-foreground mb-1">{category}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item, index) => (
                      <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">
              {isZh ? '忌' : 'Avoid'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(
                calendarDay.avoid.reduce((acc, item) => {
                  if (!acc[item.category]) acc[item.category] = [];
                  acc[item.category].push(item.name);
                  return acc;
                }, {} as Record<string, string[]>)
              ).map(([category, items]) => (
                <div key={category}>
                  <p className="text-xs text-muted-foreground mb-1">{category}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item, index) => (
                      <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 吉时凶时 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">
              {isZh ? '吉时' : 'Lucky Hours'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {calendarDay.luckyHours.map((hour, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                  <div>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      {hour.name}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2">{hour.time}</span>
                  </div>
                  {hour.description && (
                    <span className="text-xs text-muted-foreground">{hour.description}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">
              {isZh ? '凶时' : 'Unlucky Hours'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {calendarDay.unluckyHours.map((hour, index) => (
                <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  {hour.name} {hour.time}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

