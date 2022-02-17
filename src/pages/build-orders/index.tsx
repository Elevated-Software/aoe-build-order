import { Center, Grid, GridItem, Heading, Spinner, Text } from '@chakra-ui/react';
import useSWR from 'swr';
import { BuildOrderFilter } from '../../components/build-orders/BuildOrderFilter';
import { BuildOrderList } from '../../components/build-orders/BuildOrderList';
import { Container } from '../../components/Container';
import { Bo } from '../../lib/models/api';


const BuildOrders = (): JSX.Element => {
  const { data, error } = useSWR<{ success: boolean, buildOrders: Bo[]; }>('/api/build-orders');

  return (
    <Container>
      <Grid w={{ base: '90%', md: '60%' }} templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={20}>
        <GridItem colSpan={1}>
          <BuildOrderFilter />
        </GridItem>
        <GridItem colSpan={2}>
          <Heading pb={4} size="xl">Build Orders</Heading>
          {
            data
              ? <BuildOrderList buildOrders={data.buildOrders} alignContent="start" width="100%" pb={10} />
              : <Center><Spinner /></Center>
          }
        </GridItem>
      </Grid>
    </Container>
  );
};

export default BuildOrders;
