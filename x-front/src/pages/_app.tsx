import '../../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from './layout';
import { AuthProvider } from '@/context/auth-context';
import { AlertProvider } from '@/context/alert-context';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AlertProvider>
      <AuthProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
      </AuthProvider>
    </AlertProvider>
  );
}
