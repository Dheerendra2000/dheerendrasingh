import type { ReactNode } from 'react';

// The middleware now handles authentication checks for all dashboard routes.
// This layout is now only responsible for providing a consistent structure.
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
