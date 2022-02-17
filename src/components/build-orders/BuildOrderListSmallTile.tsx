import { Box, Flex, Icon, Image, Spacer, Text, useColorMode, useColorModeValue, VStack } from '@chakra-ui/react';
import { ThumbDownIcon, ThumbUpIcon } from '@heroicons/react/outline';
import { civToCode } from '../../lib/consts';
import { Bo } from '../../lib/models/api';
import { Tags } from './Tags';

interface Props {
  buildOrder: Bo;
}

export const BuildOrderListSmallTile = ({ buildOrder }: Props): JSX.Element => {
  const cardBg = useColorModeValue('#4FD1C540', '#234E5240');

  return (
    <Flex py={2} px={4} width="100%" rounded="lg" transitionDuration=".3s" _hover={{ bgColor: cardBg }}>
      <VStack mr={{ base: 2, md: 4 }} spacing={1} width={20} minWidth={10}>
        <Image
          src={`/images/flags/${civToCode[buildOrder.civilization]}.png`}
          alt={`${buildOrder.civilization} flag`}
          width={'53px'}
          height={'29px'}
          mb={1}
        />
        <Text fontSize="sm">
          <Icon as={ThumbUpIcon} color="green.500" /> {buildOrder.reactionCounts.l} <Icon as={ThumbDownIcon} color="red.400" /> {buildOrder.reactionCounts.d}
        </Text>
      </VStack>
      <VStack alignItems="start" spacing={0}>
        <Text fontWeight="semibold">{buildOrder.name}</Text>
        <Text fontSize="sm">Updated at {new Date(buildOrder.updatedAt as string).toLocaleString()}</Text>
      </VStack>
      <Spacer />
      <Tags size="sm" tags={buildOrder.tags} width={{ base: '100%', md: '40%' }} />
    </Flex>
  );
};
