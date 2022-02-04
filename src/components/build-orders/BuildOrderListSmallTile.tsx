import { Box } from '@chakra-ui/react';
import { Bo } from '../../lib/models/api';

interface Props {
  buildOrder: Bo;
}

export const BuildOrderListSmallTile = ({ buildOrder }: Props): JSX.Element => {
  return (
    <Box>Small Tile {buildOrder.name}</Box>
  );
};
