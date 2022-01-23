import { Box, Flex, HStack } from '@chakra-ui/react';
import { BoLineItem } from './bo-line-items/BoLineItem';

export const BuildOrder = (): JSX.Element => {
  return (
    <Flex p={12} bgColor='red.300'>
      Build Order
      <HStack spacing={2}>
        <BoLineItem />
      </HStack>
    </Flex>
  );
};
