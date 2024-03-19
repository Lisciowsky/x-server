import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from './layout';
import { AuthProvider } from '@/context/AuthContext';
import { AlertProvider } from '@/context/AlertContext';
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AlertProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AlertProvider >
    </AuthProvider>
  );
}
