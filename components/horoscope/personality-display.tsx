"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PersonalityTraits } from '@/lib/personality';

interface PersonalityDisplayProps {
  personality: PersonalityTraits;
  locale: string;
}

export function PersonalityDisplay({ personality, locale }: PersonalityDisplayProps) {
  const isZh = locale === 'zh';

  const sections = [
    {
      title: isZh ? '优点' : 'Strengths',
      items: personality.strengths,
      color: 'text-green-600',
    },
    {
      title: isZh ? '缺点' : 'Weaknesses',
      items: personality.weaknesses,
      color: 'text-red-600',
    },
    {
      title: isZh ? '性格特点' : 'Characteristics',
      items: personality.characteristics,
      color: 'text-blue-600',
    },
    {
      title: isZh ? '最佳配对' : 'Best Compatibility',
      items: personality.compatibility,
      color: 'text-purple-600',
    },
    {
      title: isZh ? '适合职业' : 'Suitable Careers',
      items: personality.career,
      color: 'text-orange-600',
    },
    {
      title: isZh ? '爱情观' : 'Love Style',
      items: personality.love,
      color: 'text-pink-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className={section.color}>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

