import { redirect } from 'next/navigation';
import { checkMarketingStaff } from '@/lib/cms/auth';
import CmsLoginForm from './CmsLoginForm';

export default async function CmsLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;
  const identity = await checkMarketingStaff();

  if (identity) {
    redirect(params.redirect ?? '/cms');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-navy">AMSIO CMS</h1>
        <CmsLoginForm redirectTo={params.redirect ?? '/cms'} />
      </div>
    </div>
  );
}
