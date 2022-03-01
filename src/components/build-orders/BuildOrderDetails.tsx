import { AspectRatio, Box, Heading, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { ThumbDownIcon, ThumbUpIcon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import { useCallback } from 'react';
import { BoWithPopulatedSteps } from '../../lib/models/api';
import { getLocalDate } from '../../lib/utils/dates';
import { toaster } from '../../lib/utils/toaster';
import { Tags } from './Tags';

interface Props {
  buildOrder: BoWithPopulatedSteps;
  react: (reaction: 'like' | 'dislike', direction: 1 | -1) => void;
}

export const BuildOrderDetails = ({ buildOrder, react }: Props): JSX.Element => {
  const { data: session, status } = useSession();
  const userReaction = buildOrder.reactions.find(reaction => reaction.userId.toString() === session?.user.userId);
  const loadingUser = status === 'loading';
  const iconHover = {
    cursor: loadingUser ? 'wait' : 'pointer',
  };

  const alreadyReacted = useCallback(() => {
    toaster({ message: 'You\'ve already reacted!', status: 'info' });
  }, []);

  const iconOnClick = (reaction: 'like' | 'dislike') => {
    if (loadingUser) {
      return;
    }

    if (userReaction && userReaction?.reaction !== reaction.charAt(0)) {
      alreadyReacted();
      return;
    }

    const inc = !userReaction?.reaction ? 1 : -1;
    react(reaction, inc);
  };

  return (
    <Box mb={4}>
      <Heading mb={4} fontSize="lg">Details</Heading>
      <VStack alignItems="start" spacing={1}>
        <HStack fontSize="lg" spacing={1}>
          <Icon
            as={ThumbUpIcon}
            color="green.500"
            onClick={() => iconOnClick('like')}
            _hover={iconHover}
          />
          <Text color={userReaction?.reaction === 'l' ? 'blue.300' : ''} >{buildOrder.reactionCounts.l}</Text>
          <Icon
            as={ThumbDownIcon}
            color="red.400"
            onClick={() => iconOnClick('dislike')}
            _hover={iconHover}
          />
          <Text color={userReaction?.reaction === 'd' ? 'blue.300' : ''} >{buildOrder.reactionCounts.d}</Text>
        </HStack>
        <Text>Updated At: {getLocalDate(buildOrder.updatedAt)}</Text>
        {buildOrder.patch && <Text>Patch: {buildOrder.patch}</Text>}
        <AspectRatio width={{ base: '350px', md: '500px' }} ratio={4 / 3}>
          <iframe
            title='build order video'
            src='https://www.youtube.com/embed/mO3aX06hmlc'
            allowFullScreen
          />
        </AspectRatio>
      </VStack>

    </Box>
  );
};
