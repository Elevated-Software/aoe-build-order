import { Box, Button, Heading, Select, Tag as ChakraTag, TagLabel, TagLeftIcon, Wrap, WrapItem } from '@chakra-ui/react';
import { BadgeCheckIcon, PlusCircleIcon } from '@heroicons/react/outline';
import React from 'react';
import { tagToHexWithAlpha, Tag, tagToColor, Civilization } from '../../lib/consts';

interface Props {
  selectedTags: Tag[];
  civ?: string;
  setTagsFilter: (tags: Tag[]) => void;
  setCivFilter: (civ: string) => void;
}

export const BuildOrderFilter = ({ selectedTags, civ, setTagsFilter, setCivFilter }: Props): JSX.Element => {
  const onTagClick = (tag: Tag) => {
    if (selectedTags.includes(tag)) {
      const updatedSelectedTags = selectedTags.filter(selectedTag => selectedTag !== tag);
      setTagsFilter(updatedSelectedTags);
    } else {
      setTagsFilter([...selectedTags, tag]);
    }
  };

  const onCivClick = (event: any) => {
    setCivFilter(event.target.value);
  };

  const clearAllFilters = () => {
    setTagsFilter([]);
    setCivFilter('');
  };

  return (
    <Box>
      <Heading size="md" mb={4}>Filters</Heading>
      <Heading size="sm" mb={2}>Tags</Heading>
      <Wrap mb={8}>
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
                <TagLabel mb={0.5}>{tag}</TagLabel>
              </ChakraTag>
            </WrapItem>
          ))
        }
      </Wrap>
      <Heading size="sm" mb={2}>Civilization</Heading>
      <Select placeholder="Choose A Civilization" value={civ} onChange={onCivClick} mb={8}>
        {
          Object.values(Civilization).map(civ => (
            <option key={civ} value={civ}>{civ}</option>
          ))
        }
      </Select>
      <Button colorScheme="red" onClick={clearAllFilters}>Clear All</Button>
    </Box>
  );
};
