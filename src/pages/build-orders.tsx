import { Center, Grid, GridItem, Heading, Spinner, Text } from '@chakra-ui/react';
import useSWR from 'swr';
import { BuildOrderFilter } from '../components/build-orders/BuildOrderFilter';
import { BuildOrderList } from '../components/build-orders/BuildOrderList';
import { Container } from '../components/Container';
import { Bo } from '../lib/models/api';


const BuildOrders = (): JSX.Element => {
  const { data, error } = useSWR<{ success: boolean, buildOrders: Bo[]; }>('/api/build-orders');

  return (
    <Container>
      <Grid w="80%" templateColumns="repeat(3, 1fr)" gap={4}>
        <GridItem colSpan={2}>
          <Heading pb={4} size="xl">Build Orders</Heading>
          {
            data
              ? <BuildOrderList buildOrders={data.buildOrders} alignContent="start">Hello from Build Orders</BuildOrderList>
              : <Center><Spinner /></Center>
          }

        </GridItem>
        <GridItem colSpan={1}>
          <BuildOrderFilter />
        </GridItem>
      </Grid>
    </Container>
  );
};

export default BuildOrders;
