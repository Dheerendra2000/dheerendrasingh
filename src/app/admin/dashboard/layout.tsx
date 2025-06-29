import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'admin-session';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const cookieStore = cookies();
  const hasCookie = cookieStore.has(COOKIE_NAME);

  if (!hasCookie) {
    redirect('/admin/login');
  }

  return <>{children}</>;
}
