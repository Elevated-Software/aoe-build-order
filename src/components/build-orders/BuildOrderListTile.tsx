import { Box, Flex, Grid, GridItem, Heading, HStack, SimpleGrid, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import { civToCode } from '../../lib/consts';
import { Bo } from '../../lib/models/api';

interface Props {
  buildOrder: Bo;
}

export const BuildOrderListTile = ({ buildOrder }: Props): JSX.Element => {
  const cardBg = useColorModeValue('light.cardBg', 'dark.cardBg');

  return (
    <Box px={6} py={5} shadow="md" borderWidth="1px" rounded="lg" width="100%" bgColor={cardBg}>
      {/* <Grid templateColumns='repeat(8, 1fr)'>
        <GridItem colSpan={1}>
          <Image
            src={`/images/flags/${civToCode[buildOrder.civilization]}.png`}
            alt={`${buildOrder.civilization} flag`}
            width={43}
            height={24}
          />
        </GridItem>
        <GridItem colSpan={7}>
          <Box ml={4}>
            <Heading size="sm" mb={2}>{buildOrder.name}</Heading>
            <Text>{buildOrder.description}</Text>
          </Box>
        </GridItem>
      </Grid> */}
      <VStack>
        <Flex width="100%">
          <Image
            src={`/images/flags/${civToCode[buildOrder.civilization]}.png`}
            alt={`${buildOrder.civilization} flag`}
            width={43}
            height={24}
          />
          <Heading ml={4} size="sm" alignItems="center">{buildOrder.name}</Heading>
        </Flex>
        <Text>{buildOrder.description}</Text>
      </VStack>
    </Box>
  );
};
