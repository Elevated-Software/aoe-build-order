import { CheckCircleIcon, CloseIcon } from '@chakra-ui/icons';
import { Box, BoxProps, Button, Flex, Heading, List, ListIcon, ListItem, Spacer, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

export const CallToAction = (rest: BoxProps): JSX.Element => {

  const cardBg = useColorModeValue('light.cardBg', 'dark.cardBg');
  const subText = useColorModeValue('teal.800', 'teal.300');

  const checkColor = 'green.500';
  const xColor = 'red.500';
  const features = [
    {
      feature: `Teach you new build orders`,
      icon: CheckCircleIcon,
      color: checkColor,
    },
    {
      feature: `Encourage you to try out that new Civilization`,
      icon: CheckCircleIcon,
      color: checkColor,
    },
    {
      feature: `Enable you to win`,
      icon: CheckCircleIcon,
      color: checkColor,
    },
    {
      feature: `Cook you a nice romantic dinner`,
      icon: CloseIcon,
      color: xColor,
    },
  ];

  return (
    <Box maxW="42rem" my="auto" mx={{ md: 'auto', lg: '0' }} ml={{ lg: 'auto' }} px={8} {...rest}>
      <Stack spacing={6}>
        <Text fontSize="xs" color={subText} casing="uppercase" opacity="75%">Join with other players</Text>
        <Heading as="h1" fontSize={['4xl', '6xl']} mb={6}>Organize Your<br />Build Orders</Heading>
        <List spacing={3} mb={4}>
          {features.map(feature => (
            <ListItem key={feature.feature}>
              <ListIcon as={feature.icon} color={feature.color} />
              {feature.feature}
            </ListItem>
          ))}
        </List>

        {/* Go to build orders */}
        <Box bgColor={cardBg} px={6} py={5} maxW="md" rounded="md" shadow="lg">
          <Flex alignItems="center">
            <Stack>
              <Text fontSize="xs" color="gray.500" opacity="75%">Expand your knowledge</Text>
              <Text fontSize="lg">See All Build Orders</Text>
            </Stack>
            <Spacer />
            <Link href="/build-orders" passHref>
              <Button p={6} colorScheme="green">
                Build Orders
              </Button>
            </Link>
          </Flex>
        </Box>
      </Stack>
    </Box>
  );
};
