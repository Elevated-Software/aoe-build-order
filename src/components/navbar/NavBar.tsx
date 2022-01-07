import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { DarkModeSwitch } from './DarkModeSwitch';

export const NavBar = () => {
  return (
    <Flex
      as="nav"
      alignItems="center"
      justifyContent="space-between"
      w="100%"
      maxWidth="800px"
      minWidth="356px"
      mb={8}
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
        {/* { !session &&
          <Button onClick={ () => signIn('battlenet', { callbackUrl: `${window.location.origin}/groups` }) } colorScheme="blue" disabled={ loading }>
            Sign In
          </Button>
        }
        { session &&
          <Button onClick={ () => signOut({ callbackUrl: `${window.location.origin}` }) } colorScheme="blue" disabled={ loading }>
            Sign Out
          </Button>
        } */}
      </HStack>
    </Flex>
  );
};
