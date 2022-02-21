import { Box, BoxProps, Center, Spinner, StackDivider, Text, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import useSWR from 'swr';
import { BoListItem } from '../../lib/models/api';
import { BuildOrderListSmallTile } from './BuildOrderListSmallTile';
import { BuildOrderListTile } from './BuildOrderListTile';

interface Props extends BoxProps {
  buildOrders?: BoListItem[]; // Used on the main page for Static generation
  page?: number;
  filters?: { tagsFilter: string[], civFilter?: string; };
  setPagesCount?: (pageCount: number) => void;
}

export const BuildOrderList = ({ buildOrders, page = 1, filters, setPagesCount, ...rest }: Props): JSX.Element => {
  const { data, error } = useSWR<{ success: boolean, pagesCount: number, page: number, size: number, buildOrders: BoListItem[]; }>(!buildOrders?.length ? `/api/build-orders?page=${page}&tags=${filters?.tagsFilter.join(',')}&civ=${filters?.civFilter}` : null);
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
          data
            ? data.buildOrders.map(buildOrder => (
              <BuildOrderListSmallTile key={buildOrder._id} buildOrder={buildOrder} />
            ))
            : <Center><Spinner /></Center>

        }
      </VStack>
    </Box>
  );
};
