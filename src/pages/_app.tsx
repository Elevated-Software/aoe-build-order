import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import theme from '../theme';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <ChakraProvider resetCSS theme={theme}>
        <SWRConfig value={{
          revalidateOnFocus: false,
          fetcher: (url: string) => fetch(url).then(res => res.json())
        }}>
          <Component {...pageProps} />
        </SWRConfig>
      </ChakraProvider>
    </SessionProvider>
  );
}

export default MyApp;
