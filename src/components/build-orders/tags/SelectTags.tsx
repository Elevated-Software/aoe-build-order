import { Tag as ChakraTag, TagLabel, TagLeftIcon, Wrap, WrapItem, WrapProps } from '@chakra-ui/react';
import BadgeCheckIcon from '@heroicons/react/outline/BadgeCheckIcon';
import PlusCircleIcon from '@heroicons/react/outline/PlusCircleIcon';
import { Tag, tagToColor, tagToHexWithAlpha } from '../../../lib/consts';


interface Props extends WrapProps {
  selectedTags: Tag[];
  setTagsFilter: (tags: Tag[]) => void;
}

export const SelectTags = ({ selectedTags, setTagsFilter, ...rest }: Props): JSX.Element => {
  const onTagClick = (tag: Tag) => {
    if (selectedTags.includes(tag)) {
      const updatedSelectedTags = selectedTags.filter(selectedTag => selectedTag !== tag);
      setTagsFilter(updatedSelectedTags);
    } else {
      setTagsFilter([...selectedTags, tag]);
    }
  };

  return (
    <Wrap {...rest}>
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
  );
};
