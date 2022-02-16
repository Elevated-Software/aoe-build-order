import { Box, Button, Flex, HStack, Link, Spacer, Text } from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import NextLink from 'next/link';
import { DarkModeSwitch } from './DarkModeSwitch';

export const NavBar = (): JSX.Element => {
  const { data: session, status } = useSession();
  return (
    <Flex
      as="nav"
      alignItems="center"
      justifyContent="space-between"
      w="100%"
      maxWidth="50%"
      minWidth="356px"
      mb={14}
      p={8}
      mx="auto"
    >
      <Box w={40}>
        <NextLink href={'/'} passHref>
          <Text cursor="pointer" fontSize="lg" fontWeight="bold">AOE Build Orders</Text>
        </NextLink>
      </Box>
      <HStack
        align="center"
        spacing={4}
      >
        <NextLink href="/build-orders" passHref>
          <Link fontWeight="semibold" transitionDuration=".3s" _hover={{
            color: 'teal.400',
          }}>
            Build Orders
          </Link>
        </NextLink>
        <Spacer />
        <NextLink href="">
          <Link fontWeight="semibold" transitionDuration=".3s" _hover={{
            color: 'teal.400',
          }}>
            Donate
          </Link>
        </NextLink>
        <Spacer />
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
