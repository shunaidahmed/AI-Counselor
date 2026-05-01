import type {Metadata} from 'next';
import { Poppins, Noto_Nastaliq_Urdu } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '../components/ToastContext';

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

const notoNastaliq = Noto_Nastaliq_Urdu({
  weight: ['400', '700'],
  subsets: ['arabic'],
  variable: '--font-noto',
});

export const metadata: Metadata = {
  title: 'Rahnuma AI - Career Counselor',
  description: 'AI-powered career counselor for Pakistani students.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${notoNastaliq.variable} font-sans antialiased bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800`} suppressHydrationWarning>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
