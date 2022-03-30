import { HamburgerIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, HStack, IconButton, Link, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spacer, Text } from '@chakra-ui/react';
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
      <Box display={{ base: 'flex', md: 'none' }}>
        <Spacer />
        <DarkModeSwitch />
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="outline"
            ml={4}
          />
          <MenuList>
            <NextLink href="/build-orders" passHref>
              <MenuItem>
                Build Orders
              </MenuItem>
            </NextLink>
            <NextLink href="/donate">
              <MenuItem>
                Donate
              </MenuItem>
            </NextLink>
            <MenuDivider />
            <MenuItem
              fontWeight="semibold"
              onClick={session
                ? () => signOut({ callbackUrl: `${window.location.origin}` })
                : () => signIn()
              }
              disabled={status === 'loading'}>
              {session ? 'Sign Out' : 'Sign In'}
            </MenuItem>
          </MenuList>
        </Menu>

      </Box>
      <HStack
        align="center"
        spacing={4}
        display={{ base: 'none', md: 'flex' }}
      >
        <NextLink href="/build-orders" passHref>
          <Link fontWeight="semibold" transitionDuration=".3s" _hover={{
            color: 'teal.400',
          }}>
            Build Orders
          </Link>
        </NextLink>
        <Spacer />
        <NextLink href="/donate">
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
