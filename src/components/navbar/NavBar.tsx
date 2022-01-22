import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { DarkModeSwitch } from './DarkModeSwitch';

export const NavBar = (): JSX.Element => {
  const { data: session, status } = useSession();
  return (
    <Flex
      as="nav"
      alignItems="center"
      justifyContent="space-between"
      w="100%"
      maxWidth="800px"
      minWidth="356px"
      mb={14}
      p={8}
      mx="auto"
    >
      <Box w={40}>
        <Link href={'/'} passHref>
          <Text cursor="pointer" fontSize="lg" fontWeight="bold">AOE Build Orders</Text>
        </Link>
      </Box>
      <HStack
        align="center"
        spacing={4}
      >
        <DarkModeSwitch />
        <Button
          onClick={session
            ? () => signOut({ callbackUrl: `${window.location.origin}` })
            : () => signIn()
          }
          colorScheme="blue"
          disabled={status === 'loading'}
        >
          {session ? 'Sign Out' : 'Sign In'}
        </Button>
      </HStack>
    </Flex>
  );
};
