import { ChakraProvider, createStandaloneToast, RenderProps, Text } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import theme from '../theme';

function MyApp({ Component, pageProps }: AppProps) {

  const fetcher = async (url: string) => {
    const res = await fetch(url);
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.message);
    }

    return json;
  };

  const toast = createStandaloneToast({ theme });
  const onError = (error: any) => {
    if (!toast.isActive(error.message)) {
      toast({
        id: error.message,
        position: 'top',
        title: error.message,
        description: <Text fontSize="xs">Try again later</Text>,
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    }
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
