import { Box, Heading, Tag as ChakraTag, TagLabel, TagLeftIcon, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { BadgeCheckIcon, PlusCircleIcon } from '@heroicons/react/outline';
import React from 'react';
import { tagToHexWithAlpha, Tag, tagToColor } from '../../lib/consts';

interface Props {
  selectedTags: Tag[];
  civ?: string;
  setFilters: (tags: Tag[], civ?: string) => void;
}

export const BuildOrderFilter = ({ selectedTags, civ, setFilters }: Props): JSX.Element => {
  const onTagClick = (tag: Tag) => {
    if (selectedTags.includes(tag)) {
      const updatedSelectedTags = selectedTags.filter(selectedTag => selectedTag !== tag);
      setFilters(updatedSelectedTags);
    } else {
      setFilters([...selectedTags, tag]);
    }
  };

  return (
    <Box>
      <Heading size="md" pb={4}>Filters</Heading>
      <Heading size="sm" pb={2}>Tags</Heading>
      <Wrap>
        {
          Object.values(Tag).map(tag => (
            <WrapItem key={tag}>
              <ChakraTag
                onClick={() => onTagClick(tag)}
                size="lg"
                variant={selectedTags.includes(tag) ? 'solid' : 'outline'}
                colorScheme={tagToColor[tag]}
                borderRadius="full"
                transitionDuration="0.3s"
                _hover={{
                  bgColor: tagToHexWithAlpha[tag],
                  color: 'white',
                  px: 4,
                  cursor: 'pointer'
                }}
              >
                <TagLeftIcon fontSize="xl" as={selectedTags.includes(tag) ? BadgeCheckIcon : PlusCircleIcon} />
                <TagLabel pb={0.5}>{tag}</TagLabel>
              </ChakraTag>
            </WrapItem>
          ))
        }
      </Wrap>
    </Box>
  );
};
