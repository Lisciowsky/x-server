import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from './layout';
import { AuthProvider } from '@/context/AuthContext';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </AuthProvider>
  );
}
