import { Box, Flex, Icon, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { ThumbDownIcon, ThumbUpIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { BoListItem } from '../../lib/models/api';
import { getLocalDate } from '../../lib/utils/dates';
import { FlagImage } from '../FlagImage';
import { Tags } from './tags/Tags';

interface Props {
  buildOrder: BoListItem;
}

export const BuildOrderListSmallTile = ({ buildOrder }: Props): JSX.Element => {
  const cardBg = useColorModeValue('#4FD1C540', '#234E5240');

  return (
    <Box transitionDuration=".3s" _hover={{ cursor: 'pointer', bgColor: cardBg }} w="100%">
      <Link href={`/build-orders/${buildOrder._id}`} passHref>
        <VStack py={2}>
          <Flex width="100%" rounded="lg" >
            <VStack mr={{ base: 2, md: 4 }} spacing={1} width={20} minWidth={10}>
              <FlagImage civilization={buildOrder.civilization} />
              <Text fontSize="sm">
                <Icon as={ThumbUpIcon} color="green.500" /> {buildOrder.reactionCounts.l} <Icon as={ThumbDownIcon} color="red.400" /> {buildOrder.reactionCounts.d}
              </Text>
            </VStack>
            <VStack alignItems="start" spacing={0}>
              <Text fontWeight="semibold">{buildOrder.name}</Text>
              <Text fontSize="sm">Updated at {getLocalDate(buildOrder.updatedAt)}</Text>
            </VStack>
          </Flex>
          {buildOrder.tags.length && <Tags size="sm" justify='left' tags={buildOrder.tags} w="100%" />}
        </VStack>
      </Link>

    </Box>
  );
};
