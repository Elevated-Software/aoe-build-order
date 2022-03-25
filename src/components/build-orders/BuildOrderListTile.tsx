import { Box, Heading, HStack, Icon, Text, useBreakpoint, useColorModeValue, VStack } from '@chakra-ui/react';
import { BoListItem } from '../../lib/models/api';
import { ThumbUpIcon, ThumbDownIcon } from '@heroicons/react/outline';
import { Tags } from './tags/Tags';
import { FlagImage } from '../FlagImage';
import { getLocalDate } from '../../lib/utils/dates';
import Link from 'next/link';


interface Props {
  buildOrder: BoListItem;
}

export const BuildOrderListTile = ({ buildOrder }: Props): JSX.Element => {
  const cardBg = useColorModeValue('light.cardBg', 'dark.cardBg');
  const breakpoint = useBreakpoint();
  const smallScreen = breakpoint === 'base' || breakpoint === 'sm';

  return (
    <Box px={6} py={5} shadow="md" rounded="lg" width="100%" bgColor={cardBg}>
      <VStack align="start">
        <HStack width="100%" justifyContent="stretch">
          <Box display="inline-flex" width={!smallScreen && buildOrder.tags.length ? '50%' : '100%'} alignItems="start">
            <VStack spacing={1}>
              <FlagImage civilization={buildOrder.civilization} />
              <Text fontSize="sm">
                <Icon as={ThumbUpIcon} color="green.500" /> {buildOrder.reactionCounts.l} <Icon as={ThumbDownIcon} color="red.400" /> {buildOrder.reactionCounts.d}
              </Text>
            </VStack>
            <Box ml={4}>
              <Link href={`/build-orders/${buildOrder._id}`} passHref>
                <Heading size="md" alignItems="center" transitionDuration=".2s" _hover={{ cursor: 'pointer', color: 'blue.600' }} >{buildOrder.name}</Heading>
              </Link>
              <Text fontSize="sm">Updated at {getLocalDate(buildOrder.updatedAt)}</Text>
            </Box>
          </Box>
          {!smallScreen && buildOrder.tags.length && <Tags size="md" tags={buildOrder.tags} width="50%" />}
        </HStack>
        {smallScreen && buildOrder.tags.length && <Tags size="md" justify='left' tags={buildOrder.tags} width="100%" />}
        <Text noOfLines={2}>{buildOrder.description}</Text>
      </VStack>
    </Box>
  );
};
