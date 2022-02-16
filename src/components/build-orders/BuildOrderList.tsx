import { Box, BoxProps, Divider, Heading, VStack } from '@chakra-ui/react';
import React from 'react';
import { Bo } from '../../lib/models/api';
import { BuildOrderListSmallTile } from './BuildOrderListSmallTile';
import { BuildOrderListTile } from './BuildOrderListTile';

interface Props extends BoxProps {
  size?: 'sm' | 'lg';
  buildOrders: Bo[];
}

export const BuildOrderList = ({ size = 'sm', buildOrders, ...rest }: Props): JSX.Element => {

  return (
    <Box {...rest}>
      <VStack spacing={2} alignItems="start" divider={size === 'sm' ? <Divider /> : undefined}>
        {
          buildOrders.map(buildOrder => (
            size === 'sm'
              ? <BuildOrderListSmallTile key={buildOrder._id} buildOrder={buildOrder} />
              : <BuildOrderListTile key={buildOrder._id} buildOrder={buildOrder} />
          ))
        }
      </VStack>
    </Box>
  );
};
