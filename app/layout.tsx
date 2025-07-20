import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from '@/components/ui/sonner';
import Navigation from '@/components/layout/navigation';
import { LoadingProvider } from '@/lib/loading-context';
import LoadingOverlayWrapper from '@/components/loading-overlay-wrapper';
import { QueryProvider } from '@/components/providers/queryProvider'; 

export const metadata: Metadata = {
  title: 'Relevant Research',
  description: 'Modern HR Management',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <QueryProvider>
          <LoadingProvider>
            <AuthProvider>
              <Navigation>{children}</Navigation>
              <Toaster />
              <LoadingOverlayWrapper />
            </AuthProvider>
          </LoadingProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
