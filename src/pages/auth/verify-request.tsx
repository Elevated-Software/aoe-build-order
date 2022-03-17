import { Button, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import Link from 'next/link';
import { Container } from '../../components/Container';

export default function VerifyRequest() {
  const cardBg = useColorModeValue('light.cardBg', 'dark.cardBg');

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
        my={12}>
        <Heading>
          Check your email
        </Heading>
        <Text>
          A sign in link has been sent to your email address.
        </Text>
      </Stack>
    </Container>
  );
}
