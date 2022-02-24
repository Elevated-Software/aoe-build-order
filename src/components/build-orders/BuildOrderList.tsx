import { Box, BoxProps, Center, Spinner, StackDivider, Text, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { Tag } from '../../lib/consts';
import { BoListItem } from '../../lib/models/api';
import { useBuildOrders } from '../../hooks/useBuildOrders';
import { BuildOrderListSmallTile } from './BuildOrderListSmallTile';
import { BuildOrderListTile } from './BuildOrderListTile';

interface Props extends BoxProps {
  buildOrders?: BoListItem[]; // Used on the main page for Static generation
  page?: number;
  filters?: { tagsFilter: Tag[], civFilter?: string; };
  setPagesCount?: (pageCount: number) => void;
}

export const BuildOrderList = ({ buildOrders, page = 1, filters, setPagesCount, ...rest }: Props): JSX.Element => {
  const { data, loading, error } = useBuildOrders(page, filters?.tagsFilter || [], filters?.civFilter || '');

  useEffect(() => {
    if (data && setPagesCount) {
      setPagesCount(data.pagesCount);
    }
  }, [data, setPagesCount]);

  if (buildOrders?.length) {
    return (
      <Box {...rest}>
        <VStack spacing={2} alignItems="start">
          {
            buildOrders.map(buildOrder => (
              <BuildOrderListTile key={buildOrder._id} buildOrder={buildOrder} />
            ))
          }
        </VStack>
      </Box>
    );
  }

  return (
    <Box {...rest}>
      <VStack spacing={2} alignItems="start" divider={<StackDivider />}>
        {
          loading
            ? <Center w="100%" my={10}><Spinner size="xl" /></Center>
            : error
              ? <Text>There was an error loading build orders</Text>
              : data && data.buildOrders?.map(buildOrder => (
                <BuildOrderListSmallTile key={buildOrder._id} buildOrder={buildOrder} />
              ))
        }
      </VStack>
    </Box>
  );
};
