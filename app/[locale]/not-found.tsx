import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/navigation';

export default async function NotFound() {
  const t = await getTranslations('common');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground mt-4">Page not found</p>
      <Link href="/" className="mt-4 text-primary hover:underline">
        {t('backToHome') || 'Back to Home'}
      </Link>
    </div>
  );
}

