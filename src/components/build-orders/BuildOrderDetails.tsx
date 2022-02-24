import { Box, Heading, HStack, Icon, Text } from '@chakra-ui/react';
import { ThumbDownIcon, ThumbUpIcon } from '@heroicons/react/outline';
import { Bo } from '../../lib/models/api';

interface Props {
  buildOrder: Bo;
}

export const BuildOrderDetails = ({ buildOrder }: Props): JSX.Element => {
  return (
    <Box>
      <Heading mb={4} fontSize="lg">Details</Heading>
      <HStack fontSize="lg" spacing={1}>
        <Icon as={ThumbUpIcon} color="green.500" />
        <Text>{buildOrder.reactionCounts.l}</Text>
        <Icon as={ThumbDownIcon} color="red.400" />
        <Text>{buildOrder.reactionCounts.d}</Text>
      </HStack>
    </Box>
  );
};
