import '../styles/globals.css';
import type { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.css';
import { AuthContextProvider } from '../context/AuthContext';
import { initFetch } from '../utils/fetch';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Header from '../components/Header';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(()=> { initFetch(router) }, []);
  return (
    <AuthContextProvider>
      <Header></Header>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}
