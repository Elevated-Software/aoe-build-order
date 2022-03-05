import { Box, BoxProps, Tag as ChakraTag, TagLabel, Wrap, WrapItem } from '@chakra-ui/react';
import { Tag, tagToColor } from '../../../lib/consts';


interface Props extends BoxProps {
  size: 'sm' | 'md' | 'lg';
  justify?: 'left' | 'right';

  tags: Tag[];
}

export const Tags = ({ size, tags, justify = 'right', ...rest }: Props): JSX.Element => {
  return (
    <Box {...rest}>
      <Wrap justify={justify}>
        {
          tags.map(tag => (
            <WrapItem key={tag}>
              <ChakraTag size={size} colorScheme={tagToColor[tag]} variant="solid" borderRadius="full">
                <TagLabel>
                  {tag}
                </TagLabel>
              </ChakraTag>
            </WrapItem>
          ))
        }
      </Wrap>
    </Box>
  );
};
