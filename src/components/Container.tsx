import { Box, Container as ChakraContainer, Flex, FlexProps, Link, Stack, Text, useBreakpoint, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import { NavBar } from './navbar/NavBar';

interface Props extends FlexProps {
  includeNavBar?: boolean;
}

export const Container = ({ includeNavBar = true, ...rest }: Props): JSX.Element => {
  const bg = useColorModeValue('light.bg', 'dark.bg');
  const color = useColorModeValue('light.primary', 'dark.primary');

  return (
    <Box bgColor={bg} color={color} minHeight="100vh">
      {includeNavBar && <NavBar />}
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="flex-start"
        pb={{ base: 52, md: 24, lg: 20 }}
        {...rest}
      />
      <ChakraContainer
        position="absolute"
        left="50%"
        bottom={0}
        transform="translate(-50%, 0)"
        borderTopWidth="thin"
        maxW={'90%'}
        py={4}
        as="footer" role="contentinfo" >
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ base: 'center', md: 'space-between' }}
          align={{ base: 'center', md: 'center' }}>
          <Text fontSize="sm" opacity="50%" >Age of Empires IV© Microsoft Corporation. rtsbuildorders.com.com was created by <Link href='https://www.elevatedsoftware.dev' fontWeight="semibold" transitionDuration=".3s" _hover={{ color: 'teal.400' }}>Elevated Software</Link> under Microsoft&#39;s &ldquo;Game Content Usage Rules&rdquo; using assets from Age of Empires IV , and it is not endorsed by or affiliated with Microsoft.</Text>
          <NextLink passHref href="/privacy-policy" >
            <Link fontWeight="semibold" transitionDuration=".3s" _hover={{
              color: 'teal.400',
            }}>
              <Text>Privacy Policy</Text>
            </Link>
          </NextLink>

        </Stack>
      </ChakraContainer>
    </Box>
  );
};
