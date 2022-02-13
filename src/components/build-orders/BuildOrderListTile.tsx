import { Box, Heading, HStack, Icon, Tag, TagLabel, Text, useColorModeValue, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import Image from 'next/image';
import { civToCode, tagToColor } from '../../lib/consts';
import { Bo } from '../../lib/models/api';
import { ThumbUpIcon, ThumbDownIcon } from '@heroicons/react/outline';


interface Props {
  buildOrder: Bo;
}

export const BuildOrderListTile = ({ buildOrder }: Props): JSX.Element => {
  const cardBg = useColorModeValue('light.cardBg', 'dark.cardBg');

  return (
    <Box px={6} py={5} shadow="md" borderWidth="1px" rounded="lg" width="100%" bgColor={cardBg}>
      <VStack>
        <HStack width="100%" justifyContent="stretch">
          <Box display="inline-flex" width="50%" alignItems="start">
            <Box>
              <Image
                src={`/images/flags/${civToCode[buildOrder.civilization]}.png`}
                alt={`${buildOrder.civilization} flag`}
                width={43}
                height={24}
              />
              <Text fontSize="sm">
                <Icon as={ThumbUpIcon} color="green.500" /> {buildOrder.reactionCounts.l} <Icon as={ThumbDownIcon} color="red.400" /> {buildOrder.reactionCounts.d}
              </Text>
            </Box>
            <Box ml={4}>
              <Heading size="md" alignItems="center">{buildOrder.name}</Heading>
              <Text fontSize="xs">Updated at {new Date(buildOrder.updatedAt as string).toLocaleString()}</Text>
            </Box>
          </Box>

          <Box width="50%">
            <Wrap px={2} justify="right">
              {
                buildOrder.tags.map(tag => (
                  <WrapItem key={tag}>
                    <Tag colorScheme={tagToColor[tag]} variant="solid" borderRadius="full">
                      <TagLabel>
                        {tag}
                      </TagLabel>
                    </Tag>
                  </WrapItem>
                ))
              }
            </Wrap>
          </Box>
        </HStack>
        <Text noOfLines={2}>{buildOrder.description}</Text>
      </VStack>
    </Box>
  );
};
