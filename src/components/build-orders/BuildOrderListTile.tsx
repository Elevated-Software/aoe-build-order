import { Box, Heading, HStack, Icon, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { BoListItem } from '../../lib/models/api';
import { ThumbUpIcon, ThumbDownIcon } from '@heroicons/react/outline';
import { Tags } from './tags/Tags';
import { FlagImage } from '../FlagImage';
import { getLocalDate } from '../../lib/utils/dates';


interface Props {
  buildOrder: BoListItem;
}

export const BuildOrderListTile = ({ buildOrder }: Props): JSX.Element => {
  const cardBg = useColorModeValue('light.cardBg', 'dark.cardBg');

  return (
    <Box px={6} py={5} shadow="md" rounded="lg" width="100%" bgColor={cardBg}>
      <VStack align="start">
        <HStack width="100%" justifyContent="stretch">
          <Box display="inline-flex" width="50%" alignItems="start">
            <VStack spacing={1}>
              <FlagImage civilization={buildOrder.civilization} />
              <Text fontSize="sm">
                <Icon as={ThumbUpIcon} color="green.500" /> {buildOrder.reactionCounts.l} <Icon as={ThumbDownIcon} color="red.400" /> {buildOrder.reactionCounts.d}
              </Text>
            </VStack>
            <Box ml={4}>
              <Heading size="md" alignItems="center">{buildOrder.name}</Heading>
              <Text fontSize="sm">Updated at {getLocalDate(buildOrder.updatedAt)}</Text>
            </Box>
          </Box>
          <Tags size="md" tags={buildOrder.tags} width="50%" />
        </HStack>
        <Text noOfLines={2}>{buildOrder.description}</Text>
      </VStack>
    </Box>
  );
};
