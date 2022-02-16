import { Box, Flex, Icon, Image, Spacer, Text, VStack } from '@chakra-ui/react';
import { ThumbDownIcon, ThumbUpIcon } from '@heroicons/react/outline';
import { civToCode } from '../../lib/consts';
import { Bo } from '../../lib/models/api';
import { Tags } from './Tags';

interface Props {
  buildOrder: Bo;
}

export const BuildOrderListSmallTile = ({ buildOrder }: Props): JSX.Element => {
  return (
    <Flex py={2} px={4} width="100%">
      <Box mr={4}>
        <Image
          src={`/images/flags/${civToCode[buildOrder.civilization]}.png`}
          alt={`${buildOrder.civilization} flag`}
          width={'43px'}
          height={'24px'}
          mb={1}
        />
        <Text fontSize="sm">
          <Icon as={ThumbUpIcon} color="green.500" /> {buildOrder.reactionCounts.l} <Icon as={ThumbDownIcon} color="red.400" /> {buildOrder.reactionCounts.d}
        </Text>
      </Box>
      <VStack alignItems="start" spacing={0}>
        <Text fontWeight="semibold">{buildOrder.name}</Text>
        <Text fontSize="sm">Updated at {new Date(buildOrder.updatedAt as string).toLocaleString()}</Text>
      </VStack>
      <Spacer />
      <Tags size="sm" tags={buildOrder.tags} width={{ sm: "50%", md: "35%" }} />
    </Flex>
  );
};
