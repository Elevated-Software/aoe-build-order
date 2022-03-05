import { Box, Button, Heading, Select } from '@chakra-ui/react';
import React from 'react';
import { Tag, Civilization } from '../../lib/consts';
import { SelectTags } from './tags/SelectTags';

interface Props {
  selectedTags: Tag[];
  civ?: string;
  setTagsFilter: (tags: Tag[]) => void;
  setCivFilter: (civ: string) => void;
}

export const BuildOrderFilter = ({ selectedTags, civ, setTagsFilter, setCivFilter }: Props): JSX.Element => {
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
      <SelectTags selectedTags={selectedTags} setTagsFilter={setTagsFilter} mb={8} />
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
