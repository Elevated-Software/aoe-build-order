import { ChakraProvider, createStandaloneToast, RenderProps, Text } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import { toaster } from '../lib/utils/toaster';
import theme from '../theme';

function MyApp({ Component, pageProps }: AppProps) {

  const fetcher = async (url: string) => {
    const res = await fetch(url);
    const json = await res.json();
    if (!json.success) {
      console.log('fetcher error');
      throw new Error(json.message);
    }

    return json;
  };

  const onError = (error: any) => {
    toaster({ message: error.message, status: 'error' });
  };

  return (
    <SessionProvider session={pageProps.session}>
      <ChakraProvider resetCSS theme={theme}>
        <SWRConfig value={{
          revalidateOnFocus: false,
          fetcher,
          onError,
        }}>
          <Component {...pageProps} />
        </SWRConfig>
      </ChakraProvider>
    </SessionProvider>
  );
}

export default MyApp;
