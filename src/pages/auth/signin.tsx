import { Button, Heading, Input, Stack, Text, useColorModeValue, FormControl } from '@chakra-ui/react';
import { GetServerSidePropsContext } from 'next';
import { getCsrfToken } from "next-auth/react";
import { useState } from 'react';
import { Container } from '../../components/Container';
import { toaster } from '../../lib/utils/toaster';

interface Props {
  csrfToken: string;
}

export default function SignIn({ csrfToken }: Props) {
  const cardBg = useColorModeValue('light.cardBg', 'dark.cardBg');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => setEmail(e.currentTarget.value);

  return (
    <Container>
      <Stack
        spacing={4}
        w="full"
        maxW="md"
        bg={cardBg}
        rounded="xl"
        boxShadow="lg"
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Sign In With Email
        </Heading>
        <Text opacity="75%" fontSize={{ base: 'sm', sm: 'md' }}>
          You&apos;ll get an email from noreply@elevatedsoftware.dev with a sign in link
        </Text>
        <form method="post" action="/api/auth/signin/email">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <FormControl id="email">
            <Input
              name="email"
              placeholder="your-email@example.com"
              _placeholder={{ color: 'gray.500', opacity: '75%' }}
              type="email"
              onChange={handleInputChange}
              value={email}
            />
          </FormControl>
          <Button
            mt={4}
            colorScheme="blue"
            type="submit"
          >
            Request Link
          </Button>
        </form>
      </Stack>
    </Container>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}
