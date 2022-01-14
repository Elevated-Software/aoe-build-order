import { Box, Flex, FlexProps, useColorModeValue } from '@chakra-ui/react';
import { NavBar } from './navbar/NavBar';

export const Container = (props: FlexProps): JSX.Element => {
  const bg = useColorModeValue('light.bg', 'dark.bg');
  const color = useColorModeValue('light.primary', 'dark.primary');

  return (
    <Box bg={bg} color={color} minHeight="100vh">
      <NavBar />
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="flex-start"
        {...props}
      />
    </Box>
  );
};
