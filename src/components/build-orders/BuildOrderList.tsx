import { Box, Heading, VStack } from '@chakra-ui/react';
import React from 'react';
import { Bo } from '../../lib/models/api';
import { BuildOrderListSmallTile } from './BuildOrderListSmallTile';
import { BuildOrderListTile } from './BuildOrderListTile';

interface Props {
  title?: string;
  size?: 'sm' | 'lg';
  buildOrders: Bo[];
}

export const BuildOrderList = ({ title = 'Build Orders', size = 'sm', buildOrders }: Props): JSX.Element => {

  return (
    <Box maxW="42rem" px={8}>
      <Heading pb={4} size="2xl">{title}</Heading>
      <VStack spacing={2} alignItems="start">
        {
          buildOrders.map(buildOrder => (
            size === 'sm'
              ? <BuildOrderListSmallTile buildOrder={buildOrder} />
              : <BuildOrderListTile buildOrder={buildOrder} />
          ))
        }
      </VStack>
    </Box>
  );
};
