"use client";

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/lib/navigation';
import { LanguageSwitcher } from './language-switcher';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const t = useTranslations('common');
  const pathname = usePathname();

  const navItems = [
    { href: '/horoscope', label: t('horoscope') },
    { href: '/fortune', label: t('fortune') },
    { href: '/calendar', label: t('calendar') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Sparkles className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {t('appName')}
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors rounded-md",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
